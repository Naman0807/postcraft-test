import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useReadingHistory } from "@/contexts/ReadingHistoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Share, Copy } from "lucide-react";
import { toast } from "sonner";

interface Post {
	id: string;
	title: string;
	content: string;
	created_at: string;
	author_id: string;
	author_name?: string;
}

const PostViewPage = () => {
	const { id } = useParams<{ id: string }>();
	const { addToReadingHistory } = useReadingHistory();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPost = async () => {
			if (!id) return;

			try {
				// First fetch the post
				const { data: postData, error: postError } = await supabase
					.from("posts")
					.select("*")
					.eq("id", id)
					.single();

				if (postError) throw postError;

				if (postData) {
					// Then fetch the author's profile
					const { data: profileData, error: profileError } = await supabase
						.from("profiles")
						.select("full_name")
						.eq("id", postData.author_id)
						.single();

					if (profileError) {
						console.error("Error fetching author profile:", profileError);
					}

					const post: Post = {
						...postData,
						author_name: profileData?.full_name,
					};
					setPost(post);
					// Add to reading history
					await addToReadingHistory(id);
				}
			} catch (error) {
				console.error("Error fetching post:", error);
				toast.error("Failed to load post");
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [id, addToReadingHistory]);

	const handleCopy = () => {
		if (!post) return;
		navigator.clipboard.writeText(post.content);
		toast.success("Post content copied to clipboard");
	};

	const handleShare = async () => {
		if (!post) return;
		try {
			await navigator.share({
				title: post.title,
				text: post.content,
				url: window.location.href,
			});
		} catch (error) {
			// If Web Share API is not supported or user cancels
			handleCopy();
			toast.success("Link copied to clipboard");
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="max-w-3xl mx-auto">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-muted rounded w-3/4"></div>
						<div className="h-4 bg-muted rounded w-1/4"></div>
						<div className="space-y-2 mt-8">
							<div className="h-4 bg-muted rounded"></div>
							<div className="h-4 bg-muted rounded"></div>
							<div className="h-4 bg-muted rounded w-4/5"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
					<p className="text-muted-foreground">
						The post you're looking for doesn't exist or has been removed.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-3xl mx-auto">
				<Card>
					<CardContent className="p-6">
						<h1 className="text-2xl font-bold mb-2">{post.title}</h1>
						<div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
							{post.author_name && (
								<span className="font-medium">{post.author_name}</span>
							)}
							<div className="flex items-center">
								<Clock className="w-4 h-4 mr-1" />
								<time dateTime={post.created_at}>
									{new Date(post.created_at).toLocaleDateString()}
								</time>
							</div>
						</div>

						<div className="prose max-w-none mb-6">
							{post.content.split("\n").map((paragraph, index) => (
								<p key={index} className="mb-4">
									{paragraph}
								</p>
							))}
						</div>

						<div className="flex justify-end gap-2">
							<Button variant="outline" size="sm" onClick={handleCopy}>
								<Copy className="w-4 h-4 mr-2" />
								Copy
							</Button>
							<Button variant="outline" size="sm" onClick={handleShare}>
								<Share className="w-4 h-4 mr-2" />
								Share
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default PostViewPage;
