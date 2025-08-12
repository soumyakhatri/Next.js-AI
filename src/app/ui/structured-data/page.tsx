"use client"

import { recipeSchema } from "@/app/api/structured-data/schema"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"

export default function StructuredData() {
    const [dishName, setDishName] = useState("")
    const { object, submit, stop, isLoading, error } = useObject({
        api: "/api/structured-data",
        schema: recipeSchema
    })

    return (
        <>
            {error && <div className="text-red-500 mb-4">{error.message}</div>}

            {
                object?.recipe &&
                <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 min-h-screen">
                    <div className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                        <div className="text-2xl font-semibold text-[#19c37d] mb-4">
                            {object.recipe.name}
                        </div>
                    </div>
                    
                    <div className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                        <div className="text-lg font-medium text-[#19c37d] mb-4">Ingredients</div>
                        <div className="space-y-3">
                            {object.recipe.ingredients && object.recipe.ingredients?.map((ingredient, index) => {
                                return <div key={index} className="bg-[#343541] p-3 rounded-lg border border-[#565869]">
                                    <div className="font-medium text-white">{ingredient?.name}</div>
                                    <div className="text-gray-300 text-sm">{ingredient?.amount}</div>
                                </div>
                            })}
                        </div>
                    </div>
                    
                    <div className="bg-[#444654] text-white p-6 rounded-xl border border-[#565869] shadow-sm mb-6">
                        <div className="text-lg font-medium text-[#19c37d] mb-4">Steps</div>
                        <div className="space-y-3">
                            {object.recipe.steps && object.recipe.steps.map((step, index) => {
                                return <div key={index} className="bg-[#343541] p-3 rounded-lg border border-[#565869]">
                                    <span className="inline-block bg-[#19c37d] text-white text-sm font-medium px-2 py-1 rounded-full mr-3 min-w-[2rem] text-center">
                                        {index + 1}
                                    </span>
                                    <span className="text-white">{step}</span>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            }
            <form onSubmit={(e) => {
                e.preventDefault()
                setDishName("")
                submit({
                    dish: dishName
                })
            }} className="fixed bottom-4 left-0 right-0 mx-auto max-w-2xl px-4">
                <div className="flex items-center gap-2 bg-[#343541] p-4 rounded-xl border border-[#565869] shadow-md">
                    <input
                        placeholder="Name a dish"
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                    />
                    {!isLoading ? <button
                        type="submit"
                        className="text-white bg-[#19c37d] hover:bg-[#16ab6a] px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Generate Recipe
                    </button> : <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                        onClick={stop}
                    >Stop</button>}
                </div>
            </form>
        </>
    )
}