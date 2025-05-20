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
			console.log("Auth state changed:", event, session?.user?.id);
			setSession(session);
			setUser(session?.user ?? null);

			// If login event, fetch profile data
			if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
				// Slight delay to ensure Supabase has processed the login
				setTimeout(() => {
					if (session.user && session.user.id) {
						console.log(
							"Auth event triggered profile fetch for:",
							session.user.id
						);
						fetchUserProfile(session.user.id);
					} else {
						console.error("Session user or ID missing in auth state change");
					}
				}, 500);
			} else if (event === "SIGNED_OUT") {
				// Reset local state on logout
				setRemainingFreePosts(3);
				setIsSubscribed(false);
				setSubscriptionTier(null);
				setSubscriptionEnd(null);
			}
		});

		// Check for existing session
		supabase.auth.getSession().then(({ data: { session } }) => {
			console.log("Initial session check:", session?.user?.id);
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
			console.log("Fetching profile for user:", userId);

			if (!userId) {
				console.error("fetchUserProfile called with no userId");
				return;
			}

			// Check if there's a pending profile creation in localStorage
			const pendingProfile = localStorage.getItem("pendingProfileCreation");
			if (pendingProfile) {
				try {
					const profileData = JSON.parse(pendingProfile);
					console.log("Found pending profile creation", profileData);

					// Make sure the profile ID matches the current user
					if (profileData.id === userId) {
						console.log("Creating profile from pending data");

						// Try to create the profile
						const { error: insertError } = await supabase
							.from("profiles")
							.insert(profileData);

						if (insertError) {
							console.error(
								"Error creating profile from pending data:",
								insertError
							);
						} else {
							console.log("Successfully created profile from pending data");
							// Set app state
							setRemainingFreePosts(profileData.remaining_free_posts);
							setIsSubscribed(profileData.is_subscribed);

							// Remove the pending data
							localStorage.removeItem("pendingProfileCreation");

							// We've created the profile, so we can return
							return;
						}
					}
				} catch (e) {
					console.error("Error processing pending profile:", e);
					localStorage.removeItem("pendingProfileCreation");
				}
			}

			// First fetch basic profile info
			const { data, error } = await supabase
				.from("profiles")
				.select("remaining_free_posts, is_subscribed, email, full_name")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching profile:", error);

				// If profile doesn't exist, create a new one
				if (error.code === "PGRST116") {
					console.log("Profile not found in AppContext, creating new profile");
					// Get user info for the name and email
					const {
						data: { user },
					} = await supabase.auth.getUser();

					if (user && user.email) {
						console.log("Creating profile for user:", user.id, user.email);
						// Create default profile
						const { error: insertError } = await supabase
							.from("profiles")
							.insert({
								id: userId,
								email: user.email,
								full_name: user.user_metadata?.full_name || "User",
								is_subscribed: false,
								remaining_free_posts: 3,
							});

						if (insertError) {
							console.error(
								"Error creating profile in AppContext:",
								insertError
							);
						} else {
							console.log("New profile created successfully in AppContext");
							setRemainingFreePosts(3);
							setIsSubscribed(false);
							// New user can use the default API key for their free posts
							console.log("New user will use default API key for free posts");
						}
					} else {
						console.error("User or email not available for profile creation");
					}
				}

				return;
			}

			if (data) {
				console.log("Profile data found:", data);
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
		// Get the active API key (which may be the default key for eligible users)
		const activeKey = getActiveApiKey();

		// If no API key available, return false
		if (!activeKey) return false;

		try {
			const client = getOpenAIClient(activeKey);
			return await client.validateApiKey();
		} catch (error) {
			console.error("Error validating API key:", error);
			return false;
		}
	};

	const getActiveApiKey = (): string => {
		// For free users with at least 1 free post, or subscribed users
		if ((isSubscribed || remainingFreePosts > 0) && !apiKey) {
			// Return the default API key for eligible users who haven't provided their own key
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
		// User can generate post if they are subscribed or have free posts remaining
		// AND they have a valid API key (either their own or the default key)
		return (
			(isSubscribed || remainingFreePosts > 0) &&
			(!!apiKey || !!OPENAI_CONFIG.defaultApiKey)
		);
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
