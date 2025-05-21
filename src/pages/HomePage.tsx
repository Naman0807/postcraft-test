import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";

const HomePage = () => {
	const { apiKey, session, user } = useAppContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Add a small delay to ensure authentication state is stable
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-[calc(100vh-144px)] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-144px)] flex flex-col">
			{/* Hero section */}
			<section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
						<div className="flex-1 space-y-6 text-center md:text-left mb-8 md:mb-0 md:pr-10 animate-fade-in">
							<div className="inline-block">
								<span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-100 text-primary mb-4">
									✨ AI-Powered Content Creation
								</span>
							</div>
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
								Craft Perfect <br />
								LinkedIn Posts{" "}
								<span className="text-primary">With AI Magic</span>
							</h1>
							<p className="text-xl text-muted-foreground max-w-lg md:max-w-2xl leading-relaxed">
								Transform your LinkedIn presence with AI-generated professional
								content that drives engagement. Create scroll-stopping posts and
								captivating visuals in seconds, not hours.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
								<Link to="/create">
									<Button size="lg" className="bg-primary hover:bg-accent px-8">
										Start Creating for Free →
									</Button>
								</Link>
								<Link to="/pricing">
									<Button variant="outline" size="lg" className="px-8">
										View Plans
									</Button>
								</Link>
							</div>
							<div className="flex items-center gap-4 text-sm text-muted-foreground justify-center md:justify-start">
								<div className="flex items-center">
									<svg
										className="w-4 h-4 mr-1 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									No Credit Card Required
								</div>
								<div className="flex items-center">
									<svg
										className="w-4 h-4 mr-1 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									3 Free Posts
								</div>
							</div>
						</div>
						<div className="flex-1 animate-fade-in">
							<div className="rounded-lg shadow-xl overflow-hidden bg-background">
								<div className="p-4 bg-[#0A66C2]">
									<div className="h-3 w-3 rounded-full bg-background opacity-80"></div>
								</div>
								<div className="p-6">
									<div className="flex items-center mb-4">
										<div className="w-12 h-12 rounded-full bg-secondary"></div>
										<div className="ml-3">
											<div className="h-4 w-28 bg-secondary rounded"></div>
											<div className="h-3 w-20 bg-muted mt-1 rounded"></div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="h-4 bg-secondary rounded w-full"></div>
										<div className="h-4 bg-secondary rounded w-11/12"></div>
										<div className="h-4 bg-secondary rounded w-full"></div>
										<div className="h-4 bg-secondary rounded w-10/12"></div>
									</div>
									<div className="mt-4 h-32 bg-muted rounded-lg"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 bg-white border-y border-gray-200">
				<div className="container px-4 md:px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
						<div className="text-center">
							<h3 className="text-3xl font-bold text-primary">3x</h3>
							<p className="text-sm text-muted-foreground">Higher Engagement</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-primary">5min</h3>
							<p className="text-sm text-muted-foreground">
								Average Creation Time
							</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-primary">1000+</h3>
							<p className="text-sm text-muted-foreground">Active Users</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-primary">24/7</h3>
							<p className="text-sm text-muted-foreground">AI Availability</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="py-20 bg-background">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-16">
						<span className="text-primary font-semibold">
							Features You'll Love
						</span>
						<h2 className="text-4xl font-bold mt-2 mb-4">
							Powerful AI Tools at Your Fingertips
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Everything you need to create content that stands out and drives
							engagement
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<Card className="border border-border post-card group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-3">
									Smart Post Generator
								</h3>
								<p className="text-muted-foreground mb-4">
									Generate engaging LinkedIn posts tailored to your industry,
									tone, and goals. Our AI understands your context and creates
									content that resonates.
								</p>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Multiple post formats
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Industry-specific content
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Custom tone & style
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="border border-border post-card group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-3">AI Image Creator</h3>
								<p className="text-muted-foreground mb-4">
									Create stunning, on-brand visuals that capture attention and
									boost engagement. No design skills needed.
								</p>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Professional templates
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Custom branding
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Multiple formats
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="border border-border post-card group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-3">
									Seamless Workflow
								</h3>
								<p className="text-muted-foreground mb-4">
									Streamline your content creation process with our intuitive
									tools and one-click export options.
								</p>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										One-click export
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Content library
									</li>
									<li className="flex items-center">
										<svg
											className="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										Quick sharing
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* How it Works */}
			<section className="py-20 bg-gradient-to-b from-white to-blue-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-16">
						<span className="text-primary font-semibold">Simple Process</span>
						<h2 className="text-4xl font-bold mt-2 mb-4">How It Works</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Create engaging LinkedIn content in three simple steps
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-primary">1</span>
							</div>
							<h3 className="text-xl font-semibold mb-2">Connect Your API</h3>
							<p className="text-muted-foreground">
								Simply add your OpenAI API key to get started with AI-powered
								content creation
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-primary">2</span>
							</div>
							<h3 className="text-xl font-semibold mb-2">Describe Your Post</h3>
							<p className="text-muted-foreground">
								Tell us what you want to share, and our AI will craft the
								perfect post
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-primary">3</span>
							</div>
							<h3 className="text-xl font-semibold mb-2">Generate & Share</h3>
							<p className="text-muted-foreground">
								Review your AI-generated content, make any adjustments, and
								share directly to LinkedIn
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 bg-background">
				<div className="container px-4 md:px-6">
					<div className="max-w-4xl mx-auto text-center">
						<span className="text-primary font-semibold">
							Get Started Today
						</span>
						<h2 className="text-4xl font-bold mt-2 mb-4">
							Ready to Transform Your LinkedIn Presence?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Join thousands of professionals using PostCraft to create engaging
							content. Start with 3 free posts — no credit card required.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							{!apiKey ? (
								<Link to="/settings">
									<Button size="lg" className="bg-primary hover:bg-accent px-8">
										Connect Your OpenAI API Key →
									</Button>
								</Link>
							) : (
								<Link to="/create">
									<Button size="lg" className="bg-primary hover:bg-accent px-8">
										Create Your First Post →
									</Button>
								</Link>
							)}
							<span className="text-sm text-muted-foreground">or</span>
							<Link to="/help" className="text-primary hover:underline">
								Learn more about how it works
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
