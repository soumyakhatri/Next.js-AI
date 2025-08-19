"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"

export default function GenerateImage() {
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            setIsLoading(true);
            setError(null)
            setImageSrc(null)
            setPrompt("")

            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prompt})
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            setImageSrc(`data:image/png;base64,${data}`)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong, please try later");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {error && <div>{error}</div>}
            {
                isLoading ? <div>Loading...</div>
                    : imageSrc &&
                    <Image
                        src={imageSrc}
                        alt="Generated Image"
                        height={1024}
                        width={1024}
                    />

            }
            <form onSubmit={handleSubmit}>
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the image" />
                <button type="submit" disabled={isLoading}>Generate Image</button>
            </form>
        </div>
    )
}