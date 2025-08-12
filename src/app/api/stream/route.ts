import { NextRequest } from "next/server";
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        console.log("prompt===", prompt)
        const result = streamText({
            model: openai("gpt-4.1-nano"),
            prompt
        })
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.log("error", error)
        return Response.json({error: "Failed to generate "}, {status: 500})
    }
}