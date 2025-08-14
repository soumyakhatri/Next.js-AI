"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Image from "next/image"
import { FormEvent, useRef, useState } from "react"

export default function AnalyzeImages() {
    const [input, setInput] = useState("")
    const [files, setFiles] = useState<FileList | undefined>(undefined)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { sendMessage, messages, error, status, stop } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/multi-modal-chat"
        })
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        sendMessage({
            text: input,
            files
        })
        setInput("")
        setFiles(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // console.log('messages', messages)
    // console.log('files', files)
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
                                    case "file":
                                        if (part.mediaType?.startsWith("image/")) {
                                            return <Image
                                                key={`${message.id}-${index}`}
                                                src={part.url}
                                                alt={part.filename ?? `attachment-${index}`}
                                                width={500}
                                                height={500}
                                                className="rounded-lg max-w-full h-auto"
                                            />
                                        }
                                        return null

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
                <div className="flex flex-col gap-3 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <div className="flex items-center gap-2">
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
                                className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Analyze Image
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="upload-image" className="text-gray-300 text-sm cursor-pointer flex items-center gap-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-300"
                            >
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            {files ? `${files.length} file(s) attached` : 'Attach Images'}
                        </label>
                        <input
                            id="upload-image"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(e.target.files)
                                }
                            }}
                            className="hidden"
                            ref={fileInputRef}
                            multiple
                        />
                    </div>
                </div>
            </form>
        </>
    )
}