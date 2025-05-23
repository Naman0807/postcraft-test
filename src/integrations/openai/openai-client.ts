import { OPENAI_CONFIG } from "./config";

class OpenAIClient {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async fetchWithKey(endpoint: string, options: RequestInit) {
		if (!this.apiKey) {
			throw new Error("No API key provided");
		}

		const response = await fetch(`${OPENAI_CONFIG.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.error?.message || "OpenAI API request failed");
		}

		return response.json();
	}

	/**
	 * Generate a LinkedIn post using GPT-4 chat completions
	 */
	async generatePost(
		topic: string,
		tone: string = "professional",
		details: string = "",
		maxLength: number = 250
	) {
		const prompt = `Create a LinkedIn post about "${topic}".\nTone: ${tone}${
			details ? `\nAdditional Context: ${details}` : ""
		}\n\nThe post should be approximately ${maxLength} words, attention-grabbing, formatted for readability and line breaks, professional yet conversational, include a clear call-to-action, and use 3-5 relevant hashtags. Ensure the post follows LinkedIn best practices for engagement.`;

		const response = await this.fetchWithKey("/v1/chat/completions", {
			method: "POST",
			body: JSON.stringify({
				model: OPENAI_CONFIG.models.completion,
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: OPENAI_CONFIG.defaults.completion.max_tokens,
				temperature: OPENAI_CONFIG.defaults.completion.temperature,
				presence_penalty: OPENAI_CONFIG.defaults.completion.presence_penalty,
				frequency_penalty: OPENAI_CONFIG.defaults.completion.frequency_penalty,
				n: 1,
			}),
		});

		return response.choices[0]?.message?.content;
	}

	/**
	 * Generate an image using DALL-E 3
	 */
	async generateImage(prompt: string) {
		const enhancedPrompt = `Create a professional, high-quality image suitable for a LinkedIn post about: ${prompt}. 
		The image should be modern, clean, and corporate-friendly while still being visually engaging.
		Style: Professional and polished
		Context: Business/Professional networking
		Mood: Inspiring and sophisticated`;

		const response = await this.fetchWithKey("/v1/images/generations", {
			method: "POST",
			body: JSON.stringify({
				model: OPENAI_CONFIG.models.image,
				prompt: enhancedPrompt,
				n: 1,
				...OPENAI_CONFIG.defaults.image,
			}),
		});

		return response.data[0]?.url;
	}

	/**
	 * Validate API key by making a test request
	 */
	async validateApiKey(): Promise<boolean> {
		try {
			await this.fetchWithKey("/v1/models", {
				method: "GET",
			});
			return true;
		} catch (error) {
			console.error("API key validation failed:", error);
			return false;
		}
	}
}

/**
 * Get an OpenAI client instance
 */
export const getOpenAIClient = (apiKey: string): OpenAIClient => {
	return new OpenAIClient(apiKey);
};
