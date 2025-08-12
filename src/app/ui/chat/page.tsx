"use client"

import { useChat } from "@ai-sdk/react";
import { FormEvent, useState } from "react"

export default function Chat() {
    const [input, setInput] = useState("")
    const { sendMessage, messages, error, status, stop } = useChat()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage({
            text: input
        })
        setInput("")
    }

    console.log('messages==>>', messages)

    return (
        <>
            {error && <div className="text-red-500 mb-4">{error.message}</div>}
            
            <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        Start a conversation by typing a message below
                    </div>
                )}
                
                {messages.map(message => (
                    <div key={message.id} className="mb-4">
                        <div className="text-sm font-medium text-gray-300 mb-2">
                            {message.role === "user" ? "You" : "AI"}
                        </div>
                        <div className="bg-[#444654] text-white p-4 rounded-xl border border-[#565869] shadow-sm">
                            {message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return <div key={`${message.id}-${index}`}>{part.text}</div>
                                        break;

                                    default: return null
                                        break;
                                }
                            })}
                        </div>
                    </div>
                ))}
                
                {(status === "streaming" || status === "submitted") && (
                    <div className="text-center text-gray-400 mt-4">
                        Loading messages...
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input 
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                    />
                    
                    {(status === "streaming" || status === "submitted") ? (
                        <button
                            onClick={stop}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                        >
                            Stop
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={status !== "ready"}
                            className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    )}
                </div>
            </form>
        </>
    )
}