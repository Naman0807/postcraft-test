import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Initialize Stripe with your secret key from environment variable
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
	apiVersion: "2023-10-16",
});

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// This endpoint handles Stripe webhook events for subscription changes
serve(async (req) => {
	const signature = req.headers.get("stripe-signature");

	if (!signature) {
		return new Response(JSON.stringify({ error: "No signature provided" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await req.text();
		const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
		const event = stripe.webhooks.constructEvent(
			body,
			signature,
			webhookSecret
		);

		// Handle the event
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object;
				// Get the user ID from metadata
				const userId = session.metadata.user_id;

				if (userId) {
					// Retrieve subscription details
					const subscription = await stripe.subscriptions.retrieve(
						session.subscription
					);

					// Get the subscription end date and tier
					const subscriptionTier =
						subscription.items.data[0].price.lookup_key || "monthly";
					const subscriptionEnd = new Date(
						subscription.current_period_end * 1000
					).toISOString();

					// Update user subscription in database
					const { error } = await supabase.from("subscribers").upsert({
						user_id: userId,
						email: session.customer_details.email,
						stripe_customer_id: session.customer,
						subscribed: true,
						subscription_tier: subscriptionTier,
						subscription_end: subscriptionEnd,
						updated_at: new Date().toISOString(),
					});

					if (error) {
						console.error("Error updating subscription:", error);
					}

					// Also update the profiles table for compatibility
					await supabase
						.from("profiles")
						.update({ is_subscribed: true })
						.eq("id", userId);
				}
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object;
				const customerId = subscription.customer;

				// Get the user ID from the customer
				const { data: subscribers } = await supabase
					.from("subscribers")
					.select("user_id")
					.eq("stripe_customer_id", customerId)
					.limit(1);

				if (subscribers && subscribers.length > 0) {
					const userId = subscribers[0].user_id;
					const subscriptionEnd = new Date(
						subscription.current_period_end * 1000
					).toISOString();

					// Update subscription status
					await supabase
						.from("subscribers")
						.update({
							subscribed: subscription.status === "active",
							subscription_end: subscriptionEnd,
							updated_at: new Date().toISOString(),
						})
						.eq("user_id", userId);

					// Update profiles table too for compatibility
					await supabase
						.from("profiles")
						.update({ is_subscribed: subscription.status === "active" })
						.eq("id", userId);
				}
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object;
				const customerId = subscription.customer;

				// Get the user ID from the customer
				const { data: subscribers } = await supabase
					.from("subscribers")
					.select("user_id")
					.eq("stripe_customer_id", customerId)
					.limit(1);

				if (subscribers && subscribers.length > 0) {
					const userId = subscribers[0].user_id;

					// Mark subscription as inactive
					await supabase
						.from("subscribers")
						.update({
							subscribed: false,
							updated_at: new Date().toISOString(),
						})
						.eq("user_id", userId);

					// Update profiles table too for compatibility
					await supabase
						.from("profiles")
						.update({ is_subscribed: false })
						.eq("id", userId);
				}
				break;
			}
		}

		return new Response(JSON.stringify({ received: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error(`Error processing webhook: ${err.message}`);
		return new Response(JSON.stringify({ error: err.message }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
});
