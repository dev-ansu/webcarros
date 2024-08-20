import { z } from "zod";
import { loginSchemaValidation } from "./loginSchemaValidation";

export const registerSchemaValidation = loginSchemaValidation.extend({
    name: z.string().min(2, 'O campo deve conter no mínimo dois caracteres.'),
    password: z.string().min(6, "A senha deve ter no mínimo seis caracteres.")
});

export type RegisterData = z.infer<typeof registerSchemaValidation>