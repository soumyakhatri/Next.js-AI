import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { pokemonSchema } from "./schema"

export async function POST(req: Request) {
    try {
        const { type } = await req.json()
        const result = streamObject({
            model: openai("gpt-4.1-nano"),
            schema: pokemonSchema,
            output: "array",
            prompt: `Generate a list of 5 ${type} pokemon`,
        })
        return result.toTextStreamResponse()
    } catch (error) {
        return new Response("Something went wrong", { status: 500 })
    }

}