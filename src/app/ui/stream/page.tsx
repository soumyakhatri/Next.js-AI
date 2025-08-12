"use client"
import { useCompletion } from '@ai-sdk/react'

export default function Stream() {
    const { input, handleInputChange, handleSubmit, completion, error, isLoading, setInput, stop } = useCompletion({
        api: "/api/stream"
    })
    console.log('completion', completion)
    return (
        <>
            {error && <div className="text-red-500 mb-4">{error.message}</div>}
            {
                (isLoading && !completion) ? (<div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">Loading...</div>) : (
                    <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                        <div className="bg-[#444654] text-white p-4 rounded-xl border border-[#565869] shadow-sm">
                            {completion}
                        </div>
                    </div>
                )
            }

            <form onSubmit={(e) => {
                e.preventDefault()
                setInput("")
                handleSubmit(e)
            }} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={input}
                        onChange={handleInputChange}
                    />
                    {!isLoading ? <button
                        type="submit"
                        disabled={isLoading}
                        className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Send
                    </button> : <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                        onClick={stop}
                    >Stop</button>}
                </div>
            </form>
        </>
    )
}
