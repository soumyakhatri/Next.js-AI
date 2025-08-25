import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const audio = formData.get("audio") as File;

        if (!audio) {
            return new Response("No audio file provided", { status: 400 })
        }

        const arrayBuffer = await audio.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        const transcript = await transcribe({
            model: openai.transcription("whisper-1"),
            audio: uint8Array
        })

        return Response.json(transcript)
    } catch (error) {
        console.log(error)
        return new Response("Failed to transcribe audio", { status: 500 })
    }
}