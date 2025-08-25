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
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
            {error && (
                <div className="text-red-500 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                </div>
            )}
            
            {isLoading && (
                <div className="text-center text-gray-400 mt-8 bg-[#444654] p-6 rounded-xl border border-[#565869] shadow-sm">
                    <div className="animate-pulse">Generating Speech...</div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex flex-col gap-3 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            placeholder='Enter text to convert to speech' 
                            value={text} 
                            onChange={e => setText(e.target.value)} 
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !text}
                            className="text-white bg-[#19c37d] hover:bg-[#16ab6a] disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            {isLoading ? "Generating..." : "Generate Speech"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default GenerateSpeech