// Stripe API keys and product IDs
export const STRIPE_CONFIG = {
	// Get public key from environment variable
	publishableKey:
		import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
		"pk_test_51O9rLbSHKETPvihqBYVERvt0Tr9t2YKQsyj75Xt2VRnDVdkFLg9M49bVQjTQEi5v3bj3dwVXYO2dNRNRfxR01MeQ00BpU6y66O",

	// Price IDs for the different subscription tiers
	prices: {
		monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || "price_monthly",
		yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || "price_yearly",
	},

	// Success and cancel URLs for Stripe Checkout
	redirects: {
		success: "/payment-success",
		cancel: "/pricing",
	},
};
