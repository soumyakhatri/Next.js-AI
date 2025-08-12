import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    const result = streamText({
        model: openai("gpt-4.1-nano"),
        messages: convertToModelMessages(messages)
    })

    result.usage.then(usage => console.log({
        totalMessages: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.outputTokens
    }))

    return result.toUIMessageStreamResponse()
}