import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const AuthPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { setIsSubscribed, setRemainingFreePosts } = useAppContext();

	useEffect(() => {
		// Check if user is already logged in
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				navigate("/");
			}
		};

		checkSession();
	}, [navigate]);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password || !fullName) {
			toast.error("Missing Information", {
				description: "Please fill out all fields to sign up.",
			});
			return;
		}
		try {
			setLoading(true);

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullName,
					},
				},
			});
			if (error) throw error;

			console.log("Sign up successful, user ID:", data?.user?.id); // Create a new profile for the user
			if (data?.user) {
				try {
					console.log("Creating profile for new user:", data.user.id);

					// Handle profile creation in the client
					// Since we need to wait for the login process to complete
					// before we can create the profile
					setTimeout(() => {
						// Store profile data in local storage temporarily
						localStorage.setItem(
							"pendingProfileCreation",
							JSON.stringify({
								id: data.user.id,
								email: email,
								full_name: fullName,
								is_subscribed: false,
								remaining_free_posts: 3,
							})
						);

						console.log("Profile data stored for later creation");
					}, 500);
				} catch (profileCreationError) {
					console.error(
						"Profile creation preparation failed:",
						profileCreationError
					);
				}
			}
			toast.success("Registration successful!", {
				description: "Please check your email to confirm your account.",
			});

			// If auto-confirm is enabled (for development), navigate to the login tab
			if (data?.session) {
				setIsSubscribed(false);
				setRemainingFreePosts(3);
				navigate("/");
			}
		} catch (error: any) {
			console.error("Sign up error:", error);
			toast.error(error.message || "An error occurred during sign up.");
		} finally {
			setLoading(false);
		}
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Missing Information", {
				description: "Please enter your email and password.",
			});
			return;
		}

		try {
			setLoading(true);
			console.log("Signing in with:", email);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.error("Sign in API error:", error);
				throw error;
			}
			console.log("Sign in successful, user:", data?.user?.id);

			try {
				if (!data?.user?.id) {
					console.error("No user ID available after sign in");
					throw new Error("Authentication succeeded but no user ID was found");
				}

				// Fetch user profile to get subscription status and remaining posts
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("is_subscribed, remaining_free_posts")
					.eq("id", data.user.id) // Use the user ID from the sign in result
					.single();

				if (profileError) {
					console.error("Profile fetch error:", profileError);
					// If the profile doesn't exist, create one
					if (profileError.code === "PGRST116") {
						console.log(
							"Profile not found, creating new profile for:",
							data.user.id
						);

						// Create a new profile
						const { error: insertError } = await supabase
							.from("profiles")
							.insert({
								id: data.user.id,
								email: email,
								full_name: data.user.user_metadata?.full_name || "User",
								is_subscribed: false,
								remaining_free_posts: 3,
							});

						if (insertError) {
							console.error("Profile creation error:", insertError);
						} else {
							console.log("Profile created successfully during sign in");
							setIsSubscribed(false);
							setRemainingFreePosts(3);
						}
					}
				} else if (profile) {
					console.log("Found existing profile:", profile);
					setIsSubscribed(profile.is_subscribed);
					setRemainingFreePosts(profile.remaining_free_posts);
				} // Wait briefly to ensure state is updated before navigation
				setTimeout(() => {
					console.log("Navigating to homepage after successful login");
					navigate("/", { replace: true });
				}, 300);
			} catch (profileError: any) {
				console.error("Error in profile handling:", profileError);
				// Still navigate even if there's a profile error
				navigate("/");
			}
		} catch (error: any) {
			console.error("Sign in error:", error);
			toast.error(error.message || "An error occurred during sign in.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-primary">
						Welcome to PostCraft
					</h1>
					<p className="text-muted-foreground mt-2">
						Create engaging LinkedIn posts with AI
					</p>
				</div>

				<Tabs defaultValue="signin" className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-6">
						<TabsTrigger value="signin">Sign In</TabsTrigger>
						<TabsTrigger value="signup">Sign Up</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<Card>
							<CardHeader>
								<CardTitle>Sign In</CardTitle>
								<CardDescription>
									Enter your credentials to access your account
								</CardDescription>
							</CardHeader>
							<form onSubmit={handleSignIn}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signin-email">Email</Label>
										<Input
											id="signin-email"
											type="email"
											placeholder="your@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signin-password">Password</Label>
										<Input
											id="signin-password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										className="w-full bg-primary hover:bg-accent"
										disabled={loading}
									>
										{loading ? "Signing in..." : "Sign In"}
									</Button>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>

					<TabsContent value="signup">
						<Card>
							<CardHeader>
								<CardTitle>Create an Account</CardTitle>
								<CardDescription>Get started with 3 free posts</CardDescription>
							</CardHeader>
							<form onSubmit={handleSignUp}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signup-name">Full Name</Label>
										<Input
											id="signup-name"
											type="text"
											placeholder="John Doe"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-email">Email</Label>
										<Input
											id="signup-email"
											type="email"
											placeholder="your@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-password">Password</Label>
										<Input
											id="signup-password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										className="w-full bg-primary hover:bg-accent"
										disabled={loading}
									>
										{loading ? "Creating account..." : "Create Account"}
									</Button>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default AuthPage;
