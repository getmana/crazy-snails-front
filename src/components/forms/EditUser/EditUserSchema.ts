import { z } from 'zod';

export const EditUserSchema = z.object({
    username: z.string().min(3, 'Username should be at least 3 characters long if provided').or(z.literal('')).optional(),
    email: z.email({ message: 'Invalid email address' }).or(z.literal('')).optional(),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
