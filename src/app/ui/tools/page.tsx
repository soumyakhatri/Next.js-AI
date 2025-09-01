"use client"

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useState } from "react"
import { ChatMessage } from "@/app/api/tools/route";

export default function ToolChat() {
    const [input, setInput] = useState("")
    const { sendMessage, messages, error, status, stop } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: "/api/tools"
        })
    })

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
            {error && <div className="text-red-500 mb-4 font-medium bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg">{error.message}</div>}

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

                                    case "tool-getWeather":
                                        switch (part.state) {
                                            case "input-streaming":
                                                return (
                                                    <div key={`${message.id}-getWeather-${index}`} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                                            <span className="text-blue-300 font-medium text-sm">Receiving weather request...</span>
                                                        </div>
                                                        <pre className="text-xs bg-[#2d2d2d] p-2 rounded border border-[#565869] overflow-x-auto text-gray-300">
                                                            {JSON.stringify(part.input, null, 2)}
                                                        </pre>
                                                    </div>
                                                )
                                            case "input-available":
                                                return (
                                                    <div key={`${message.id}-getWeather-${index}`} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                            <span className="text-green-300 text-sm">Getting weather for <span className="font-semibold">{part.input.city}</span></span>
                                                        </div>
                                                    </div>
                                                )
                                            case "output-available":
                                                return (
                                                    <div key={`${message.id}-getWeather-${index}`} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                            <span className="text-emerald-300 text-sm">Weather: <span className="font-semibold">{part.output}</span></span>
                                                        </div>
                                                    </div>
                                                )
                                            case "output-error":
                                                return (
                                                    <div key={`${message.id}-getWeather-${index}`} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                            <span className="text-red-300 text-sm">Error: <span className="font-semibold">{part.errorText}</span></span>
                                                        </div>
                                                    </div>
                                                )
                                            default:
                                                return null;
                                        }

                                    default: return null
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