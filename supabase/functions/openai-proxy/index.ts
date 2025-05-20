import { serve } from "https://deno.fresh.dev/std@0.168.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		const apiKey = Deno.env.get("OPENAI_API_KEY");
		if (!apiKey) {
			throw new Error("Missing OpenAI API Key");
		}

		const url = new URL(req.url);
		const openaiPath = url.pathname.replace("/openai-proxy", "");

		const response = await fetch(`https://api.openai.com${openaiPath}`, {
			method: req.method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: req.body,
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
});
