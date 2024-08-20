import { z } from "zod";

export const newCarSchemaValidation = z.object({
    name: z.string().min(1, 'O campo nome é obrigatório'),
    model: z.string().min(1, 'O campo modelo é obrigatório'),
    year: z.union([z.string(), z.number()]).refine((value)=>{
        const parsedYear = typeof value === 'string' ? parseInt(value, 10):value;
        return !isNaN(parsedYear) && parsedYear >= 1900;
    }, {message: "Digite um ano válido."}),
    km: z.union([z.number(), z.string()]).refine((value)=>{
        const km = typeof value === 'string' ? Number(value):value;
        return !isNaN(km) && km >= 0 && value;
    }, {message: "Digite um valor válido, ex.: 1333.33"}),
    price: z.union([z.number(), z.string()]).refine((value)=>{
        const price = typeof value === 'string' ? Number(value):value;
        return !isNaN(price) && price >= 0 && value;
    }, {message: "Digite um valor válido, ex.: 1333.33"}),
    city: z.string().min(1, 'O campo cidade é obrigatório'),
    whatsapp: z.string().min(1, 'O campo WhatsApp é obrigatório').refine((value) => /^(\d{10,12})$/.test(value),{
        message: "Número de telefone inválido."
    }),
    description: z.string().min(1, "O campo descrição é obrigatório.")
})

export type NewCarData = z.infer<typeof newCarSchemaValidation>