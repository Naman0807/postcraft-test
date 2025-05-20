
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpPage = () => {
  return (
    <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help & FAQ</h1>
      
      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I start using PostCraft?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Getting started with PostCraft is easy:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go to the Settings page and add your OpenAI API key</li>
                    <li>Navigate to the Create Post page</li>
                    <li>Enter a topic and any additional details</li>
                    <li>Click "Generate LinkedIn Post" or "Generate Post Image"</li>
                    <li>Copy your post or download your image</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Where do I get an OpenAI API key?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    You can get an OpenAI API key by signing up at <a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer" className="text-postcraft-primary hover:underline">platform.openai.com</a>. After creating an account, generate an API key from the API Keys section in your account settings.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How many posts can I create with the free trial?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    With the free trial, you can create up to 3 LinkedIn posts or images. After that, you'll need to subscribe to our Premium plan for unlimited access.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Using PostCraft</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What makes a good LinkedIn post?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Effective LinkedIn posts typically include:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>An attention-grabbing first line</li>
                    <li>Short, readable paragraphs</li>
                    <li>Personal insights or experiences</li>
                    <li>Valuable information for your audience</li>
                    <li>A clear call-to-action or question at the end</li>
                    <li>Relevant hashtags (3-5 is optimal)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I edit the generated content?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes! After PostCraft generates your LinkedIn post, you can copy it to your clipboard and make any edits or adjustments before posting it to LinkedIn. We recommend adding your personal touches for maximum authenticity.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What image formats are supported?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    PostCraft generates images in JPG format with dimensions optimized for LinkedIn posts. You can download these images and use them directly in your LinkedIn posts.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing & Subscription</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    PostCraft offers a simple monthly subscription of $15/month for unlimited access to post and image generation. You'll be billed on the same date each month and can cancel anytime.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    To cancel your subscription, go to the Settings page and click on "Manage Subscription". Follow the prompts to cancel. Your access will continue until the end of your current billing period.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Do you bill for OpenAI API usage?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    No, PostCraft does not bill for your OpenAI API usage. You provide your own API key and are billed directly by OpenAI for any usage. Our subscription only covers access to the PostCraft platform and features.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, feel free to contact our support team.
            </p>
            <p className="text-gray-600">
              Email us at: <a href="mailto:support@postcraft.ai" className="text-postcraft-primary hover:underline">support@postcraft.ai</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
