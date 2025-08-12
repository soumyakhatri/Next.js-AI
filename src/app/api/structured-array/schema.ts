import z from "zod";

export const pokemonSchema = z.object({
    name: z.string(),
    abilties: z.array(z.string())
})

export const pokemonUiSchema = z.array(pokemonSchema)