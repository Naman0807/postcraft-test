
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";

const HomePage = () => {
  const { apiKey } = useAppContext();

  return (
    <div className="min-h-[calc(100vh-144px)] flex flex-col">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <div className="flex-1 space-y-6 text-center md:text-left mb-8 md:mb-0 md:pr-10 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Create Engaging LinkedIn Posts <span className="text-postcraft-primary">With AI</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg md:max-w-2xl">
                Generate professional LinkedIn content and eye-catching images in seconds with PostCraft's AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/create">
                  <Button size="lg" className="bg-postcraft-primary hover:bg-postcraft-accent">
                    Create Your Post
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 animate-fade-in">
              <div className="rounded-lg shadow-xl overflow-hidden bg-white">
                <div className="p-4 bg-[#0A66C2]">
                  <div className="h-3 w-3 rounded-full bg-white opacity-80"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="ml-3">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-100 mt-1 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                  </div>
                  <div className="mt-4 h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create attention-grabbing LinkedIn content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border border-gray-200 post-card">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-postcraft-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Post Generator</h3>
                <p className="text-gray-600">
                  Generate professional LinkedIn posts tailored to your industry and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 post-card">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-postcraft-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Image Generation</h3>
                <p className="text-gray-600">
                  Create custom images that complement your posts and increase engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 post-card">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-postcraft-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
                <p className="text-gray-600">
                  Copy your content or download images with one click for immediate use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Engaging LinkedIn Content?</h2>
            <p className="text-gray-600 mb-8">
              Start with 3 free posts. No credit card required.
            </p>
            
            {!apiKey ? (
              <Link to="/settings">
                <Button size="lg" className="bg-postcraft-primary hover:bg-postcraft-accent">
                  Connect Your OpenAI API Key
                </Button>
              </Link>
            ) : (
              <Link to="/create">
                <Button size="lg" className="bg-postcraft-primary hover:bg-postcraft-accent">
                  Start Creating
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
