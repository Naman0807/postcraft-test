import { FC } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getOpenAIClient } from "./openai-client";
import { toast } from "sonner";

interface PostGenerationOptions {
	topic: string;
	tone?: string;
	details?: string;
	maxLength?: number;
}

interface ImageGenerationOptions {
	prompt: string;
	topic: string;
}

export const usePostGeneration = () => {
	const {
		getActiveApiKey,
		isSubscribed,
		decrementRemainingPosts,
		canGeneratePost,
	} = useAppContext();

	const generatePost = async ({
		topic,
		tone = "professional",
		details = "",
		maxLength = 250,
	}: PostGenerationOptions) => {
		if (!canGeneratePost()) {
			toast.error("No remaining posts available", {
				description: "Please subscribe to continue generating posts",
			});
			return null;
		}

		const apiKey = getActiveApiKey();
		if (!apiKey) {
			toast.error("API key required", {
				description: isSubscribed
					? "There was an error with the API key. Please try again or contact support."
					: "Please provide your OpenAI API key in settings.",
			});
			return null;
		}

		try {
			const client = getOpenAIClient(apiKey);
			const content = await client.generatePost(
				topic,
				tone,
				details,
				maxLength
			);

			// Decrement remaining posts if not subscribed
			if (!isSubscribed) {
				await decrementRemainingPosts();
			}

			return content;
		} catch (error) {
			console.error("Error generating post:", error);
			toast.error("Failed to generate post", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
			return null;
		}
	};

	const generateImage = async ({ prompt, topic }: ImageGenerationOptions) => {
		if (!canGeneratePost()) {
			toast.error("No remaining posts available", {
				description: "Please subscribe to continue generating images",
			});
			return null;
		}

		const apiKey = getActiveApiKey();
		if (!apiKey) {
			toast.error("API key required", {
				description: isSubscribed
					? "There was an error with the API key. Please try again or contact support."
					: "Please provide your OpenAI API key in settings.",
			});
			return null;
		}

		try {
			const client = getOpenAIClient(apiKey);
			const enhancedPrompt = `Create a professional and engaging LinkedIn post image about ${topic}. ${prompt}`;
			const imageUrl = await client.generateImage(enhancedPrompt);

			// Decrement remaining posts if not subscribed
			if (!isSubscribed) {
				await decrementRemainingPosts();
			}

			return imageUrl;
		} catch (error) {
			console.error("Error generating image:", error);
			toast.error("Failed to generate image", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
			return null;
		}
	};

	return {
		generatePost,
		generateImage,
	};
};
