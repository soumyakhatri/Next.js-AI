import { openai } from "@ai-sdk/openai"
import { experimental_generateSpeech as generateSpeech } from "ai"

export async function POST(req: Request) {
    try {
        const { text } = await req.json()

        const { audio } = await generateSpeech({
            model: openai.speech("tts-1"),
            text
        })

        // Force into a fresh ArrayBuffer backed Uint8Array

        const fixed = new Uint8Array(audio.uint8Array)

        // const blob = new Blob([fixed], { type: audio.mediaType || "audio/mpeg" })

        return new Response(fixed, {
            headers: {
                "Content-Type": audio.mediaType || "audio/mpeg"
            }
        });
    } catch (error) {
        console.log("Error generating speech", error)
        return new Response("Failed to generate speech", {
            status: 500
        })
    }

}