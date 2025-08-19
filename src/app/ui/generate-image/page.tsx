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
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
            {error && (
                <div className="text-red-500 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                </div>
            )}
            
            {isLoading ? (
                <div className="text-center text-gray-400 mt-8 bg-[#444654] p-6 rounded-xl border border-[#565869] shadow-sm">
                    <div className="animate-pulse">Generating image...</div>
                </div>
            ) : imageSrc && (
                <div className="mb-6">
                    <div className="bg-[#444654] p-4 rounded-xl border border-[#565869] shadow-sm">
                        <Image
                            src={imageSrc}
                            alt="Generated Image"
                            height={1024}
                            width={1024}
                            className="rounded-lg max-w-full h-auto"
                        />
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex flex-col gap-3 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            placeholder="Describe the image you want to generate..." 
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="text-white bg-[#19c37d] hover:bg-[#16ab6a] disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            {isLoading ? "Generating..." : "Generate Image"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}