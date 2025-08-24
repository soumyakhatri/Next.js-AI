"use client"
import { Experimental_TranscriptionResult as Transcription } from "ai";
import { ChangeEvent, FormEvent, useRef, useState } from "react"

export default function TranscribeAudio() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState<Transcription | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files?.[0])
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("File not selected")
            return
        }

        setIsLoading(true);
        setTranscript(null);
        setError(null)
        setSelectedFile(null)

        const formData = new FormData()
        formData.append("audio", selectedFile)
        try {
            const response = await fetch("/api/transcribe-audio", {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error("Something went wrong, try again later")
            }

            const data = await response.json()

            setTranscript(data)
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setIsLoading(false);
        setError(null);
        setSelectedFile(null)
        setTranscript(null);
        if (inputRef.current) {
            inputRef.current.value = ""
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
                    <div className="animate-pulse">Transcribing audio...</div>
                </div>
            )}
            
            {transcript && !isLoading && (
                <div className="mb-6">
                    <div className="bg-[#444654] p-4 rounded-xl border border-[#565869] shadow-sm">
                        <h3 className="text-lg font-medium text-white mb-3">Transcript:</h3>
                        <div className="text-white">{transcript.text}</div>
                        
                        {transcript?.language && (
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-white mb-2">Language:</h3>
                                <div className="text-white">{transcript.language}</div>
                            </div>
                        )}
                        
                        {transcript?.durationInSeconds && (
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-white mb-2">Duration:</h3>
                                <div className="text-white">{transcript.durationInSeconds.toFixed(1)} seconds</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex flex-col gap-3 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <div className="flex items-center gap-3">
                        <label 
                            htmlFor="audio-file" 
                            className="flex-1 bg-[#444654] text-white p-3 rounded-lg border border-[#565869] cursor-pointer hover:bg-[#4a4d5a] transition-colors duration-200 text-center"
                        >
                            {selectedFile ? `${selectedFile.name} selected` : 'Select an audio file'}
                        </label>
                        <input 
                            type="file" 
                            accept="audio/*" 
                            id="audio-file" 
                            ref={inputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        {selectedFile && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
                            >
                                Reset
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={isLoading || !selectedFile}
                            className="flex-1 text-white bg-[#19c37d] hover:bg-[#16ab6a] disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-3 rounded-md transition-colors duration-200"
                        >
                            {isLoading ? "Transcribing..." : "Transcribe Audio"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}