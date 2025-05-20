// OpenAI API configuration
export const OPENAI_CONFIG = {
	// Base URL for OpenAI API
	baseUrl: "https://api.openai.com/v1",

	// Models to use for different purposes
	models: {
		completion: "gpt-4", // LinkedIn posts require high quality, coherent text
		image: "dall-e-3", // Best quality images for professional LinkedIn content
	},

	// Default parameters for API calls
	defaults: {
		// Text generation parameters
		completion: {
			temperature: 0.7, // Good balance between creativity and professionalism
			max_tokens: 1000, // Enough for a full LinkedIn post with details
			presence_penalty: 0.2, // Slightly penalize repetitive content
			frequency_penalty: 0.3, // Encourage diverse vocabulary
		},
		// Image generation parameters
		image: {
			size: "1024x1024", // High resolution for professional images
			quality: "standard",
			style: "natural", // Professional look for LinkedIn
		},
	},
};
