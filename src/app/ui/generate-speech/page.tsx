"use client"

import React, { FormEvent, useState } from 'react'

function GenerateSpeech() {
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true)
        setText("")
        setError(null)

        try {
            const res = await fetch("/api/generate-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text})
            })

            if (!res.ok) {
                throw new Error("Error generating speech")
            }

            const blob = await res.blob()

            const audioUrl = URL.createObjectURL(blob)
            const audio = new Audio(audioUrl)
            audio.play()

            audio.addEventListener("ended", () => {
                URL.revokeObjectURL(audioUrl)
            })
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error generating speech.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {
                error && <div>{error}</div>
            }
            {
                isLoading && <div>Generating Speech...</div>
            }
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Enter text to convert to speech' value={text} onChange={e => setText(e.target.value)} />
                <button type="submit" disabled={isLoading || !text}>Generate Speech</button>
            </form>
        </div>
    )
}

export default GenerateSpeech