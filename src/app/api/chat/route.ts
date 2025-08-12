import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: openai("gpt-4.1-nano"),
        messages: [
            {
                role: "system",
                content: "You have to give a general idea to children about the countries they ask about. Give the answer in not more than three sentences."
            }, // when just this part is added it is system prompt.
            {
                role: "user",
                content: "Tell me about India"
            },
            {
                role: "assistant",
                content: "India is in Asia. Its capital is New Delhi. There are many languages spoken in India."
            }, // when example chats are provided it is few shot learning.

            ...convertToModelMessages(messages)
        ]
    })

    result.usage.then(usage => console.log({
        totalMessages: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.outputTokens
    }))

    return result.toUIMessageStreamResponse()
}