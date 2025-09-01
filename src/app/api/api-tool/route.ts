import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, InferUITools, stepCountIs, streamText, tool, UIDataTypes, UIMessage } from "ai"
import { z } from "zod"

const WeatherApiKey = process.env.WEATHER_API_KEY

const tools = {
    getWeather: tool({
        description: "Get the weather for a location",
        inputSchema: z.object({
            city: z.string().describe("The city to get the weather for")
        }),
        execute: async ({ city }) => {
            const result = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WeatherApiKey}&q=${city}`);
            const data = await result.json();
            const weatherData = {
                location: {
                    name: data.location.name,
                    country: data.location.country,
                    localtime: data.location.localtime
                },
                current: {
                    temp_c: data.current.temp_c,
                    condition: {
                        text: data.current.condition.text,
                        code: data.current.condition.code,
                        icon: data.current.condition.icon
                    }
                }
            }

            return weatherData;
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()

        const result = streamText({
            model: openai("gpt-4.1-mini"),
            messages: convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.log(error);
        return new Response("Failed to stream chat", { status: 500 })
    }

}