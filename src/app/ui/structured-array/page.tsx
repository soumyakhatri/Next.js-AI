"use client"
import { pokemonUiSchema } from "@/app/api/structured-array/schema"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"

export default function StructuredArray() {
    const [type, setType] = useState("")
    const { submit, object, error, isLoading, stop } = useObject({
        api: "/api/structured-array",
        schema: pokemonUiSchema
    })
    return (
        <>
            {error && <div className="text-red-500 mb-4">{error.message}</div>}

            {
                object && 
                <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                    {object.map((pokemon, i) => (
                        <div key={i} className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                            <div className="text-2xl font-semibold text-[#19c37d] mb-4">
                                {pokemon?.name}
                            </div>
                            
                            <div className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                                <div className="text-lg font-medium text-[#19c37d] mb-4">Abilities</div>
                                <div className="space-y-3">
                                    {pokemon?.abilties && pokemon.abilties.map((ability, abilityIndex) => {
                                        return <div key={abilityIndex} className="bg-[#343541] p-3 rounded-lg border border-[#565869]">
                                            <span className="text-white">{ability}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            <form onSubmit={(e) => {
                e.preventDefault()
                setType("")
                submit({
                    type
                })
            }} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input
                        placeholder="Type of pokemon"
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                    {!isLoading ? <button
                        type="submit"
                        disabled={isLoading || !type.trim()}
                        className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Generate
                    </button> : <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                        onClick={stop}
                    >Stop</button>}
                </div>
            </form>
        </>
    )
}