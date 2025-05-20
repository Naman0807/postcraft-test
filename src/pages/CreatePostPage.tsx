import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostGeneration } from "@/integrations/openai/post-generation";

const CreatePostPage = () => {
	const { apiKey } = useAppContext();
	const { generatePost, generateImage } = usePostGeneration();

	const [topic, setTopic] = useState("");
	const [tone, setTone] = useState("professional");
	const [industry, setIndustry] = useState("");
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [generatedPost, setGeneratedPost] = useState("");
	const [generatedImage, setGeneratedImage] = useState("");

	const handleGeneratePost = async () => {
		if (!topic) {
			toast.error("Please enter a topic for your LinkedIn post.", {
				description: "Topic Required",
			});
			return;
		}

		try {
			setLoading(true);
			const postContent = await generatePost({
				topic,
				tone,
				details: industry ? `Industry context: ${industry}` : "",
			});

			if (postContent) {
				setGeneratedPost(postContent);
				toast.success("Your LinkedIn post has been successfully created!", {
					description: "Post Generated",
				});
			}
		} catch (error) {
			console.error("Error generating post:", error);
			toast.error("Failed to generate post. Please try again.", {
				description: error instanceof Error ? error.message : undefined,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleGenerateImage = async () => {
		if (!topic) {
			toast.error("Please enter a topic for your image.", {
				description: "Topic Required",
			});
			return;
		}

		try {
			setImageLoading(true);
			const prompt = `Create a professional LinkedIn post image about ${topic}${
				industry ? ` in the ${industry} industry` : ""
			}.`;

			const imageUrl = await generateImage({
				topic,
				prompt,
			});

			if (imageUrl) {
				setGeneratedImage(imageUrl);
				toast.success(
					"Your LinkedIn post image has been successfully created!",
					{
						description: "Image Generated",
					}
				);
			}
		} catch (error) {
			console.error("Error generating image:", error);
			toast.error("Failed to generate image. Please try again.", {
				description: error instanceof Error ? error.message : undefined,
			});
		} finally {
			setImageLoading(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedPost);
		toast.success("Your post has been copied to clipboard.", {
			description: "Copied to clipboard",
		});
	};

	return (
		<div className="container py-8 px-4 md:px-6 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Create LinkedIn Post</h1>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				<div className="md:col-span-5">
					<Card>
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-4">Post Details</h2>

							<div className="space-y-4">
								<div>
									<label
										htmlFor="topic"
										className="block text-sm font-medium text-foreground mb-1"
									>
										Topic or Main Idea *
									</label>
									<Input
										id="topic"
										placeholder="e.g., Leadership in Remote Teams"
										value={topic}
										onChange={(e) => setTopic(e.target.value)}
									/>
								</div>

								<div>
									<label
										htmlFor="industry"
										className="block text-sm font-medium text-foreground mb-1"
									>
										Industry (Optional)
									</label>
									<Input
										id="industry"
										placeholder="e.g., Technology, Finance, Healthcare"
										value={industry}
										onChange={(e) => setIndustry(e.target.value)}
									/>
								</div>

								<div>
									<label
										htmlFor="tone"
										className="block text-sm font-medium text-foreground mb-1"
									>
										Tone
									</label>
									<select
										id="tone"
										className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
										value={tone}
										onChange={(e) => setTone(e.target.value)}
									>
										<option value="professional">Professional</option>
										<option value="conversational">Conversational</option>
										<option value="inspirational">Inspirational</option>
										<option value="educational">Educational</option>
										<option value="thought-leadership">
											Thought Leadership
										</option>
									</select>
								</div>

								<Tabs defaultValue="post">
									<TabsList className="grid grid-cols-2">
										<TabsTrigger value="post">Generate Post</TabsTrigger>
										<TabsTrigger value="image">Generate Image</TabsTrigger>
									</TabsList>

									<TabsContent value="post" className="pt-4">
										<Button
											onClick={handleGeneratePost}
											disabled={loading || !topic}
											className="w-full bg-primary hover:bg-accent"
										>
											{loading ? "Generating..." : "Generate LinkedIn Post"}
										</Button>
									</TabsContent>

									<TabsContent value="image" className="pt-4">
										<Button
											onClick={handleGenerateImage}
											disabled={imageLoading || !topic}
											className="w-full bg-primary hover:bg-accent"
										>
											{imageLoading ? "Generating..." : "Generate Post Image"}
										</Button>
									</TabsContent>
								</Tabs>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-7">
					<Card className="h-full">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-semibold">Generated Content</h2>
								{generatedPost && (
									<Button variant="outline" onClick={copyToClipboard} size="sm">
										Copy
									</Button>
								)}
							</div>

							{loading ? (
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-11/12" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-10/12" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							) : generatedPost ? (
								<Textarea
									className="min-h-[300px] linkedin-post resize-none"
									value={generatedPost}
									readOnly
								/>
							) : (
								<div className="text-center py-12 text-gray-500">
									<p>Your generated post will appear here</p>
								</div>
							)}

							{imageLoading ? (
								<div className="mt-6">
									<Skeleton className="h-[200px] w-full rounded-md" />
								</div>
							) : generatedImage ? (
								<div className="mt-6">
									<h3 className="text-lg font-medium mb-2">Generated Image</h3>
									<img
										src={generatedImage}
										alt="Generated post image"
										className="w-full rounded-md shadow-sm image-preview"
									/>
									<div className="mt-2 text-right">
										<a
											href={generatedImage}
											download="linkedin-post-image.jpg"
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-primary hover:underline"
										>
											Download Image
										</a>
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Usage Tips */}
			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-4">
					Tips for Effective LinkedIn Posts
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardContent className="p-4">
							<h3 className="font-medium mb-2">Start with a Hook</h3>
							<p className="text-sm text-muted-foreground">
								Begin your post with an attention-grabbing first line that makes
								readers want to click "see more".
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<h3 className="font-medium mb-2">Use Short Paragraphs</h3>
							<p className="text-sm text-muted-foreground">
								Break up your text into 1-2 sentence paragraphs for better
								readability on mobile devices.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<h3 className="font-medium mb-2">Include a Call to Action</h3>
							<p className="text-sm text-muted-foreground">
								End with a question or invitation for comments to boost
								engagement with your post.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CreatePostPage;
