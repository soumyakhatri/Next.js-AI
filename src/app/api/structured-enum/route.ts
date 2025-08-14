import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const result = await generateObject({
            model: openai("gpt-4.1-mini"),
            enum: ["positive", "negative", "neutral"],
            output: "enum",
            prompt: `Classify the sentiment of the text: ${text}`
        })
        return result.toJsonResponse()
    } catch (error) {
        console.log(error);
        return new Response("Something went wrong", {status: 500})
    }
}