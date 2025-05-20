import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CalendarIcon, CreditCard, Loader } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SubscriptionManagement = () => {
	const {
		isSubscribed,
		subscriptionTier,
		subscriptionEnd,
		loadingSubscription,
		cancelSubscription,
		beginCheckout,
	} = useAppContext();

	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [isUpgrading, setIsUpgrading] = useState(false);
	const navigate = useNavigate();

	// Format tier name for display
	const formatTierName = (tier: string | null) => {
		if (!tier) return "Free";
		if (tier === "monthly") return "Premium Monthly";
		if (tier === "yearly") return "Premium Annual";
		return tier;
	};

	// Format date for display
	const formatDate = (date: Date | null) => {
		if (!date) return "N/A";
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	// Handle subscription cancellation
	const handleCancelSubscription = async () => {
		setIsCancelling(true);
		try {
			const success = await cancelSubscription();
			if (success) {
				setShowCancelDialog(false);
			}
		} finally {
			setIsCancelling(false);
		}
	};

	// Handle subscription upgrade
	const handleUpgrade = async (tier: "monthly" | "yearly") => {
		setIsUpgrading(true);
		try {
			const checkoutUrl = await beginCheckout(tier);
			if (checkoutUrl) {
				window.location.href = checkoutUrl;
			}
		} finally {
			setIsUpgrading(false);
		}
	};

	// Determine if the user can upgrade to yearly
	const canUpgradeToYearly = isSubscribed && subscriptionTier === "monthly";

	return (
		<Card>
			<CardHeader>
				<CardTitle>Subscription</CardTitle>
				<CardDescription>Manage your PostCraft subscription</CardDescription>
			</CardHeader>

			<CardContent>
				{loadingSubscription ? (
					<div className="flex items-center justify-center p-6">
						<Loader className="h-6 w-6 animate-spin text-postcraft-primary mr-2" />
						<span>Loading subscription details...</span>
					</div>
				) : (
					<>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium">Current Plan</p>
									<p className="text-2xl font-bold">
										{isSubscribed
											? formatTierName(subscriptionTier)
											: "Free Trial"}
									</p>
								</div>

								{isSubscribed && (
									<div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
										Active
									</div>
								)}
							</div>

							{isSubscribed && subscriptionEnd && (
								<div className="flex items-center gap-2 text-gray-600">
									<CalendarIcon className="h-4 w-4" />
									<span className="text-sm">
										Renews on {formatDate(subscriptionEnd)}
									</span>
								</div>
							)}

							<Separator className="my-4" />

							{isSubscribed ? (
								<div className="space-y-4">
									<div>
										<p className="font-medium mb-1">Subscription Benefits</p>
										<ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
											<li>Unlimited LinkedIn posts</li>
											<li>Unlimited custom images</li>
											<li>Advanced AI templates</li>
											<li>Priority support</li>
											{subscriptionTier === "yearly" && (
												<li>2 months free compared to monthly plan</li>
											)}
										</ul>
									</div>

									{canUpgradeToYearly && (
										<Alert
											variant="default"
											className="bg-blue-50 border-blue-200"
										>
											<AlertCircle className="h-4 w-4 text-blue-600" />
											<AlertTitle>Want to save more?</AlertTitle>
											<AlertDescription>
												Upgrade to our annual plan and get 2 months free.
											</AlertDescription>
										</Alert>
									)}
								</div>
							) : (
								<div className="space-y-4">
									<Alert
										variant="default"
										className="bg-amber-50 border-amber-200"
									>
										<AlertCircle className="h-4 w-4 text-amber-600" />
										<AlertTitle>Limited Access</AlertTitle>
										<AlertDescription>
											You're currently on the free trial. Subscribe to unlock
											unlimited posts and features.
										</AlertDescription>
									</Alert>
								</div>
							)}
						</div>
					</>
				)}
			</CardContent>

			<CardFooter className="flex flex-col sm:flex-row gap-2">
				{!isSubscribed ? (
					<Button
						className="w-full sm:w-auto bg-postcraft-primary hover:bg-postcraft-accent"
						onClick={() => navigate("/pricing")}
					>
						View Plans
					</Button>
				) : (
					<>
						{canUpgradeToYearly && (
							<Button
								className="w-full sm:w-auto bg-postcraft-primary hover:bg-postcraft-accent"
								onClick={() => handleUpgrade("yearly")}
								disabled={isUpgrading}
							>
								{isUpgrading ? "Processing..." : "Upgrade to Annual"}
							</Button>
						)}

						<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
							<DialogTrigger asChild>
								<Button variant="outline" className="w-full sm:w-auto">
									Cancel Subscription
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Cancel Subscription</DialogTitle>
									<DialogDescription>
										Are you sure you want to cancel your subscription? You'll
										lose access to premium features at the end of your current
										billing period.
									</DialogDescription>
								</DialogHeader>

								<div className="bg-gray-50 p-4 rounded-md my-4">
									<div className="flex items-center gap-2 mb-2">
										<CreditCard className="h-5 w-5 text-gray-600" />
										<p className="font-medium">Your subscription details</p>
									</div>
									<p className="text-sm text-gray-600">
										Plan: {formatTierName(subscriptionTier)}
									</p>
									<p className="text-sm text-gray-600">
										Active until: {formatDate(subscriptionEnd)}
									</p>
								</div>

								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setShowCancelDialog(false)}
										disabled={isCancelling}
									>
										Keep Subscription
									</Button>
									<Button
										variant="destructive"
										onClick={handleCancelSubscription}
										disabled={isCancelling}
									>
										{isCancelling ? "Processing..." : "Confirm Cancellation"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</>
				)}
			</CardFooter>
		</Card>
	);
};

export default SubscriptionManagement;
