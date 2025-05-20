export const OPENAI_CONFIG = {
	// use local dev proxy when running `vite dev`
	baseUrl: import.meta.env.DEV ? "" : "https://api.openai.com/v1",
	models: {
		completion: "gpt-4",
		image: "dall-e-3",
	},
	defaults: {
		completion: {
			temperature: 0.7,
			max_tokens: 1000,
			presence_penalty: 0.2,
			frequency_penalty: 0.3,
		},
		image: {
			size: "1024x1024",
			quality: "standard",
			style: "natural",
		},
	},
	defaultApiKey: import.meta.env.VITE_DEFAULT_OPENAI_API_KEY || "",
};
