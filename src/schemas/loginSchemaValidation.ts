import { z } from "zod";

export const loginSchemaValidation = z.object({
    email: z.string().min(1, 'O campo email é obrigatório.').email("Digite um e-mail válido."),
    password: z.string().min(1, 'O campo senha é obrigatório.'),
})

export type LoginData = z.infer<typeof loginSchemaValidation>