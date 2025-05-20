import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

// Initialize Stripe with your secret key from environment variable
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
	apiVersion: "2023-10-16",
});

const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:5173";

serve(async (req) => {
	try {
		const { user_id, price_id, email } = await req.json();

		if (!user_id || !price_id) {
			return new Response(
				JSON.stringify({
					error: "Missing required parameters",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// Get or create customer
		let customerId;
		const { data: customers, error: searchError } =
			await stripe.customers.search({
				query: `email:'${email}'`,
			});

		if (searchError || !customers || customers.length === 0) {
			// Create a new customer
			const newCustomer = await stripe.customers.create({
				email,
				metadata: {
					supabase_user_id: user_id,
				},
			});
			customerId = newCustomer.id;
		} else {
			customerId = customers[0].id;
		}

		// Create a new checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [
				{
					price: price_id,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${SITE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${SITE_URL}/pricing`,
			metadata: {
				user_id,
			},
		});

		return new Response(JSON.stringify({ url: session.url }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
});
