import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_CONFIG } from "./config";
import { supabase } from "../supabase/client";

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Types
export type SubscriptionTier = "monthly" | "yearly";

export interface StripeCheckoutOptions {
	priceId: string;
	successUrl: string;
	cancelUrl: string;
	customerId?: string;
	customerEmail?: string;
}

export const stripe = {
	/**
	 * Create a checkout session with Stripe
	 */
	async createCheckoutSession(
		userId: string,
		email: string,
		tier: SubscriptionTier
	): Promise<string | null> {
		try {
			// Get or create Stripe customer ID
			const customer = await stripe.getOrCreateCustomer(userId, email);

			if (!customer) {
				throw new Error("Failed to create or retrieve customer");
			}

			// Call Supabase Edge Function to create a checkout session
			// Note: In a production environment, you'd create a Supabase Edge Function to handle this
			// For this example, we'll use a simulated response

			// This URL will be replaced by the actual edge function response
			const checkoutUrl = `https://checkout.stripe.com/c/pay/cs_test_${Math.random()
				.toString(36)
				.substring(2, 15)}`;

			return checkoutUrl;
		} catch (error) {
			console.error("Error creating checkout session:", error);
			return null;
		}
	},

	/**
	 * Get or create a Stripe customer for the user
	 */
	async getOrCreateCustomer(
		userId: string,
		email: string
	): Promise<string | null> {
		try {
			// First check if user already has a stripe_customer_id
			const { data: subscriber } = await supabase
				.from("subscribers")
				.select("stripe_customer_id")
				.eq("user_id", userId)
				.single();

			if (subscriber?.stripe_customer_id) {
				return subscriber.stripe_customer_id;
			}

			// In a real implementation, you would call a Supabase Edge Function to create a customer
			// Simulate creating a customer with a fake ID
			const customerId = `cus_${Math.random().toString(36).substring(2, 12)}`;

			// Save the customer ID to the database
			await supabase.from("subscribers").upsert({
				user_id: userId,
				email: email,
				stripe_customer_id: customerId,
				subscribed: false,
			});

			return customerId;
		} catch (error) {
			console.error("Error getting/creating customer:", error);
			return null;
		}
	},

	/**
	 * Check the subscription status for a user
	 */
	async checkSubscriptionStatus(userId: string): Promise<{
		isActive: boolean;
		tier?: string;
		endDate?: Date;
	}> {
		try {
			const { data } = await supabase
				.from("subscribers")
				.select("*")
				.eq("user_id", userId)
				.single();

			if (!data || !data.subscribed) {
				return { isActive: false };
			}

			return {
				isActive: data.subscribed,
				tier: data.subscription_tier,
				endDate: data.subscription_end
					? new Date(data.subscription_end)
					: undefined,
			};
		} catch (error) {
			console.error("Error checking subscription:", error);
			return { isActive: false };
		}
	},

	/**
	 * Cancel a subscription
	 */
	async cancelSubscription(userId: string): Promise<boolean> {
		try {
			// In a real implementation, you would call a Supabase Edge Function to cancel via Stripe API
			// For this example, we'll just update the database directly

			const { error } = await supabase
				.from("subscribers")
				.update({
					subscribed: false,
					subscription_end: new Date().toISOString(),
				})
				.eq("user_id", userId);

			if (error) throw error;

			return true;
		} catch (error) {
			console.error("Error canceling subscription:", error);
			return false;
		}
	},
};
