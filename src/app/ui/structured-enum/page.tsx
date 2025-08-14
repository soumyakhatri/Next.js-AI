"use client"

import { FormEvent, useState } from "react"

export default function StructuredEnum() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sentiment, setSentiment] = useState("");

    const analyzeSentiment = async (e: FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        setText("");
        setError(null)
        try {
            const res = await fetch("/api/structured-enum", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }
            setSentiment(data)
        } catch (error) {
            setError("Something went wrong")
        } finally{
            setIsLoading(false)
        }

    }
    return (
        <>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {
                isLoading ? (
                    <div className="text-center text-gray-700 text-lg font-medium">Analyzing sentiment...</div>
                ) : sentiment ? (
                    <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                        <div className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                            <div className="text-2xl font-semibold text-[#19c37d] mb-4">
                                Sentiment Analysis Result
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {sentiment === "positive" && "😊 Positive"}
                                {sentiment === "negative" && "😞 Negative"}
                                {sentiment === "neutral" && "😐 Neutral"}
                            </div>
                        </div>
                    </div>
                ) : null
            }

            <form onSubmit={analyzeSentiment} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input
                        placeholder="Enter text to analyze.."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !text.trim()}
                        className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Analyze
                    </button>
                </div>
            </form>
        </>
    )
}