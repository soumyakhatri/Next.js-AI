"use client"

import { FormEvent, useState } from "react"

export default function Completion() {
    const [prompt, setPrompt] = useState("")
    const [completion, setCompletion] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const complete = async (e: FormEvent) => {
        e.preventDefault()
        setPrompt('')
        setLoading(true)
        try {
            const res = await fetch('/api/completion', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            })
            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }
            setCompletion(data.text)

        } catch (error) {
            console.log('error', error)
            setError(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {
                loading ? (<div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">Loading...</div>) : (completion ? (
                    <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                        <div className="bg-[#444654] text-white p-4 rounded-xl border border-[#565869] shadow-sm">
                            {completion}
                        </div>
                    </div>
                ) : null)
            }


            <form onSubmit={complete} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input
                        placeholder="Ask me something..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Send
                    </button>
                </div>
            </form>
        </>
    )
}
