import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "./recipeSchema";
import { streamObject } from "ai";

export async function POST(req: Request) {
    try {
        const { dish } = await req.json();

        const result = streamObject({
            model: openai("gpt-4.1-nano"),
            schema: recipeSchema,
            prompt: `Generate a recipe for ${dish}`,
        })

        return result.toTextStreamResponse()
    } catch (error) {
        console.log(error);
        return new Response("Something went wrong", {status: 500})
    }

}