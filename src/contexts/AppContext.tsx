import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { stripe } from "@/integrations/stripe/stripe-client";
import { getOpenAIClient } from "@/integrations/openai/openai-client";
import { OPENAI_CONFIG } from "@/integrations/openai/config";

interface AppContextType {
	apiKey: string;
	setApiKey: (key: string) => void;
	getActiveApiKey: () => string;
	remainingFreePosts: number;
	setRemainingFreePosts: (count: number) => void;
	isSubscribed: boolean;
	setIsSubscribed: (status: boolean) => void;
	checkApiKeyValidity: () => Promise<boolean>;
	decrementRemainingPosts: () => void;
	canGeneratePost: () => boolean;
	session: Session | null;
	user: User | null;
	signOut: () => Promise<void>;
	subscriptionTier: string | null;
	subscriptionEnd: Date | null;
	loadingSubscription: boolean;
	beginCheckout: (tier: "monthly" | "yearly") => Promise<string | null>;
	cancelSubscription: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
	const [apiKey, setApiKey] = useState<string>(
		() => localStorage.getItem("openai_api_key") || ""
	);
	const [remainingFreePosts, setRemainingFreePosts] = useState<number>(() => {
		const stored = localStorage.getItem("remaining_free_posts");
		return stored ? parseInt(stored) : 3;
	});
	const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
		return localStorage.getItem("is_subscribed") === "true";
	});
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
	const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
	const [loadingSubscription, setLoadingSubscription] =
		useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("openai_api_key", apiKey);
	}, [apiKey]);

	useEffect(() => {
		localStorage.setItem("remaining_free_posts", remainingFreePosts.toString());
	}, [remainingFreePosts]);

	useEffect(() => {
		localStorage.setItem("is_subscribed", isSubscribed.toString());
	}, [isSubscribed]);

	useEffect(() => {
		// Set up auth state listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setUser(session?.user ?? null);

			// If login event, fetch profile data
			if (event === "SIGNED_IN" && session) {
				setTimeout(() => {
					fetchUserProfile(session.user.id);
				}, 0);
			}
		});

		// Check for existing session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);

			if (session?.user) {
				fetchUserProfile(session.user.id);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const fetchUserProfile = async (userId: string) => {
		try {
			// First fetch basic profile info
			const { data, error } = await supabase
				.from("profiles")
				.select("remaining_free_posts, is_subscribed")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching profile:", error);
				return;
			}

			if (data) {
				setRemainingFreePosts(data.remaining_free_posts);
				setIsSubscribed(data.is_subscribed);
			}

			// Now fetch subscription details if any
			fetchSubscriptionDetails(userId);
		} catch (error) {
			console.error("Error fetching user profile:", error);
		}
	};

	const fetchSubscriptionDetails = async (userId: string) => {
		setLoadingSubscription(true);
		try {
			const { data, error } = await supabase
				.from("subscribers")
				.select("*")
				.eq("user_id", userId)
				.single();

			if (error && error.code !== "PGRST116") {
				// PGRST116 means no rows returned, which is fine for new users
				console.error("Error fetching subscription:", error);
				return;
			}

			if (data && data.subscribed) {
				setIsSubscribed(true);
				setSubscriptionTier(data.subscription_tier);
				setSubscriptionEnd(
					data.subscription_end ? new Date(data.subscription_end) : null
				);
			}
		} catch (error) {
			console.error("Error fetching subscription details:", error);
		} finally {
			setLoadingSubscription(false);
		}
	};

	const checkApiKeyValidity = async (): Promise<boolean> => {
		// If subscribed and no custom API key, use default key
		if (isSubscribed && !apiKey && OPENAI_CONFIG.defaultApiKey) {
			return true;
		}

		// If not subscribed and no API key provided, return false
		if (!apiKey) return false;

		try {
			const client = getOpenAIClient(apiKey);
			return await client.validateApiKey();
		} catch (error) {
			console.error("Error validating API key:", error);
			return false;
		}
	};

	const getActiveApiKey = (): string => {
		// If user is subscribed and hasn't provided their own key, use the default key
		if (isSubscribed && !apiKey && OPENAI_CONFIG.defaultApiKey) {
			return OPENAI_CONFIG.defaultApiKey;
		}
		// Otherwise use the user's API key
		return apiKey;
	};

	const decrementRemainingPosts = async () => {
		if (!isSubscribed && remainingFreePosts > 0) {
			const newCount = remainingFreePosts - 1;

			setRemainingFreePosts(newCount);

			if (user) {
				try {
					await supabase
						.from("profiles")
						.update({ remaining_free_posts: newCount })
						.eq("id", user.id);
				} catch (error) {
					console.error("Error updating remaining posts:", error);
				}
			}

			if (newCount === 0) {
				toast.info(
					"You've used all your free posts. Subscribe to continue using PostCraft.",
					{
						description: "Free trial completed",
					}
				);
			}
		}
	};

	const canGeneratePost = (): boolean => {
		return isSubscribed || remainingFreePosts > 0;
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setRemainingFreePosts(3);
		setIsSubscribed(false);
		setSubscriptionTier(null);
		setSubscriptionEnd(null);
	};

	/**
	 * Start the checkout process for a subscription
	 */
	const beginCheckout = async (
		tier: "monthly" | "yearly"
	): Promise<string | null> => {
		if (!user || !user.email) {
			toast.error("Please sign in to subscribe", {
				description: "Authentication Required",
			});
			return null;
		}

		try {
			// Call Stripe service to create checkout session
			const checkoutUrl = await stripe.createCheckoutSession(
				user.id,
				user.email,
				tier
			);
			return checkoutUrl;
		} catch (error) {
			console.error("Error starting checkout:", error);
			toast.error("Failed to start checkout process. Please try again.", {
				description: "Checkout Error",
			});
			return null;
		}
	};

	/**
	 * Cancel the current subscription
	 */
	const cancelSubscription = async (): Promise<boolean> => {
		if (!user) return false;

		try {
			const success = await stripe.cancelSubscription(user.id);

			if (success) {
				setIsSubscribed(false);
				toast.success("Your subscription has been cancelled successfully.", {
					description: "Subscription Cancelled",
				});
				return true;
			}

			throw new Error("Failed to cancel subscription");
		} catch (error) {
			console.error("Error cancelling subscription:", error);
			toast.error("Failed to cancel subscription. Please try again later.", {
				description: "Error",
			});
			return false;
		}
	};

	const value = {
		apiKey,
		setApiKey,
		getActiveApiKey, // Add this to the context value
		remainingFreePosts,
		setRemainingFreePosts,
		isSubscribed,
		setIsSubscribed,
		checkApiKeyValidity,
		decrementRemainingPosts,
		canGeneratePost,
		session,
		user,
		signOut,
		subscriptionTier,
		subscriptionEnd,
		loadingSubscription,
		beginCheckout,
		cancelSubscription,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
}
