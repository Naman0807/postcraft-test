import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionManagement from "@/components/SubscriptionManagement";

const SettingsPage = () => {
	const { apiKey, setApiKey, remainingFreePosts, isSubscribed } =
		useAppContext();
	const { toast } = useToast();
	const [newApiKey, setNewApiKey] = useState(apiKey);
	const [showApiKey, setShowApiKey] = useState(false);
	const [saveLoading, setSaveLoading] = useState(false);

	const handleSaveKey = async () => {
		if (!newApiKey) {
			toast.error("API Key Required", {
				description: "Please enter your OpenAI API key.",
			});
			return;
		}

		if (!newApiKey.startsWith("sk-")) {
			toast.error("Invalid API Key", {
				description: "Please enter a valid OpenAI API key starting with 'sk-'.",
			});
			return;
		}

		try {
			setSaveLoading(true);

			// Simulate API validation
			setTimeout(() => {
				setApiKey(newApiKey);
				setSaveLoading(false);
				toast.success("API Key Saved", {
					description: "Your OpenAI API key has been saved successfully.",
				});
			}, 1000);
		} catch (error) {
			console.error("Error saving API key:", error);
			setSaveLoading(false);
			toast.error("Error", {
				description: "Failed to save API key. Please try again.",
			});
		}
	};

	return (
		<div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Settings</h1>

			<div className="space-y-6">
				{/* API Key Section */}
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-semibold mb-4">OpenAI API Key</h2>
						<p className="text-sm text-muted-foreground mb-4">
							PostCraft uses OpenAI's API to generate LinkedIn posts and images.
							You'll need to provide your own API key.
							<a
								href="https://platform.openai.com/account/api-keys"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline ml-1"
							>
								Get an API key here.
							</a>
						</p>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="apiKey"
									className="block text-sm font-medium text-foreground mb-1"
								>
									API Key
								</label>
								<div className="relative">
									<Input
										id="apiKey"
										type={showApiKey ? "text" : "password"}
										placeholder="sk-..."
										value={newApiKey}
										onChange={(e) => setNewApiKey(e.target.value)}
									/>
									<button
										type="button"
										onClick={() => setShowApiKey(!showApiKey)}
										className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-foreground"
									>
										{showApiKey ? "Hide" : "Show"}
									</button>
								</div>
							</div>

							<div className="flex justify-end">
								<Button
									onClick={handleSaveKey}
									disabled={saveLoading || !newApiKey}
									className="bg-primary hover:bg-accent"
								>
									{saveLoading ? "Saving..." : "Save API Key"}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Subscription Management */}
				<SubscriptionManagement />

				{/* Account Status for Free Trial */}
				{!isSubscribed && (
					<Card>
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-4">Free Trial</h2>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">Remaining Free Posts</h3>
										<p className="text-sm text-muted-foreground">
											Posts left in your free trial
										</p>
									</div>
									<div className="text-lg font-bold">{remainingFreePosts}</div>
								</div>

								<div className="pt-2">
									<Button
										className="w-full bg-primary hover:bg-accent"
										onClick={() => (window.location.href = "/pricing")}
									>
										Upgrade to Premium
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Preferences */}
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-semibold mb-4">Preferences</h2>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Email Notifications</h3>
									<p className="text-sm text-muted-foreground">
										Receive updates and tips
									</p>
								</div>
								<Switch />
							</div>

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">AI Model</h3>
									<p className="text-sm text-muted-foreground">
										Default AI model to use
									</p>
								</div>
								<select
									className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
									defaultValue="gpt-4"
								>
									<option value="gpt-4">GPT-4 (Best Quality)</option>
									<option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SettingsPage;
