import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, InferUITools, stepCountIs, streamText, tool, UIDataTypes, UIMessage } from "ai"
import { z } from "zod"

const tools = {
    web_search_preview: openai.tools.webSearchPreview({})
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()

        const result = streamText({
            model: openai.responses("gpt-4.1-mini"),
            messages: convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.log(error);
        return new Response("Failed to stream chat", {status: 500})
    }

}