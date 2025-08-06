import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json()
        const { text } = await generateText({
            model: openai("gpt-4.1-nano"),
            prompt: prompt
        })

        return Response.json({ text })
    } catch (error) {
        console.log('error', error)
        return Response.json({ error: "Failed to generate text" }, { status: 500 })
    }

}