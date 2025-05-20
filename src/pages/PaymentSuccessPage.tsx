import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Check, Loader } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const PaymentSuccessPage = () => {
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { user } = useAppContext();

	useEffect(() => {
		// In production, you would validate the session_id with Stripe
		// and update the user's subscription status
		// For now, we'll simulate success and redirect after a delay

		const timer = setTimeout(() => {
			setIsLoading(false);

			// If no session_id is provided, treat as an error
			if (!sessionId) {
				setError("Invalid payment session");
			}
		}, 1500);

		return () => clearTimeout(timer);
	}, [sessionId]);

	// Redirect to home if not authenticated
	useEffect(() => {
		if (!user && !isLoading) {
			navigate("/");
		}
	}, [user, isLoading, navigate]);

	return (
		<div className="container py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<h1 className="text-2xl font-bold">
						Payment {isLoading ? "Processing" : "Successful"}
					</h1>
				</CardHeader>

				<CardContent className="text-center">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center p-8">
							<Loader className="h-12 w-12 animate-spin text-postcraft-primary mb-4" />
							<p className="text-gray-600">Validating your payment...</p>
						</div>
					) : error ? (
						<div className="p-8">
							<p className="text-red-500 mb-4">{error}</p>
							<p className="text-gray-600">
								There was a problem processing your payment. Please try again or
								contact support if the issue persists.
							</p>
						</div>
					) : (
						<div className="p-8">
							<div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
								<Check className="h-10 w-10 text-green-600" />
							</div>

							<h2 className="text-xl font-semibold mb-4">
								Thank You For Subscribing!
							</h2>

							<p className="text-gray-600 mb-6">
								Your subscription to PostCraft Premium has been activated
								successfully. You now have unlimited access to all premium
								features.
							</p>

							<div className="bg-gray-50 rounded-lg p-4 mb-6">
								<h3 className="font-semibold mb-2">What's Next?</h3>
								<ul className="text-left space-y-2">
									<li className="flex items-start">
										<Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
										<span>Create unlimited LinkedIn posts</span>
									</li>
									<li className="flex items-start">
										<Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
										<span>Generate custom images for your content</span>
									</li>
									<li className="flex items-start">
										<Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
										<span>Access premium templates and features</span>
									</li>
								</ul>
							</div>
						</div>
					)}
				</CardContent>

				<CardFooter className="flex justify-center">
					<Button
						className="bg-postcraft-primary hover:bg-postcraft-accent"
						onClick={() => navigate("/create")}
						disabled={isLoading || !!error}
					>
						Start Creating
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default PaymentSuccessPage;
