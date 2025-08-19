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
        <div>
            {error && <div>{error}</div>}
            {isLoading && <div>Transcribing audio</div>}
            {transcript && !isLoading && (
                <>
                    <div>
                        <h3>Transcript:</h3>
                        <div>{transcript.text} </div>
                    </div>

                    {transcript?.language && <div>
                        <h3>Language:</h3>
                        <div>{transcript.language} </div>
                    </div>
                    }
                    {transcript?.durationInSeconds && <div>
                        <h3>Duration:</h3>
                        <div>{transcript.durationInSeconds.toFixed(1)} seconds </div>
                    </div>}
                </>

            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor="audio-file">{selectedFile ? `${selectedFile.name} selected` : 'Select a file'}</label>
                <input type="file" accept="audio/*" id="audio-file" ref={inputRef} onChange={handleFileChange} className="hidden" />
                {selectedFile && <button onClick={resetForm}>Reset</button>}
                {<button type="submit" disabled={isLoading || !selectedFile}>Transcribe</button>}
            </form>
        </div>
    )
}