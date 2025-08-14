"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Image from "next/image"
import { FormEvent, useRef, useState } from "react"

export default function AnalyzeImages() {
    const [input, setInput] = useState("")
    const [files, setFiles] = useState<FileList | undefined>(undefined)
    const imageRef = useRef(null)

    const { sendMessage, messages } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/multi-modal-chat"
        })
    })

    // console.log('messages', messages)
    // console.log('files', files)
    return (
        <>
            <div>
                {
                    messages && messages.length > 0 && messages.map((message) => {
                        return <div>
                            <div>{message.role === "user" ? "You:" : "AI:"}</div>
                            {message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return part.text
                                        break;
                                    case "file":
                                        if (part.mediaType?.startsWith("image/")) {
                                            return <Image
                                                key={`${message.id}-${index}`}
                                                src={part.url}
                                                alt={part.filename ?? `attachment-${index}`}
                                                width={500}
                                                height={500}
                                            />
                                        }

                                    default:
                                        break;
                                }
                            })}
                        </div>
                    })
                }
            </div>
            <div>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter your text here" />
                <form onSubmit={(e: FormEvent) => {
                    e.preventDefault()
                    sendMessage({
                        text: input,
                        files
                    })
                    setInput("")
                    setFiles(undefined)
                }}>
                    <div>
                        <label htmlFor="upload-image">Attach Images</label>
                        <input
                            id="upload-image"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(e.target.files)
                                }
                            }}
                            className="hidden"
                            ref={imageRef}
                            multiple
                        />
                        <span>{files ? `${files.length} file(s) attached` : 'Attach File'}</span>
                    </div>
                    <button type="submit">Analyze Image</button>
                </form>
            </div>
        </>
    )
}