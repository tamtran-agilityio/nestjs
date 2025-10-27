import { z } from 'zod';

export const CreateUserSchema = z.object({
    userName: z.string().min(3),
    password: z.string().min(8),
    age: z.number().min(0).optional(),
    email: z.string().email(),
    isActive: z.boolean().optional(),
}).required();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;