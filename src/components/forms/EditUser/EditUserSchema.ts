import { z } from 'zod';

export const EditUserSchema = z.preprocess(
    (obj: Partial<{ username: string; email: string }>) => ({
        ...obj,
        username: obj.username === '' ? undefined : obj.username,
        email: obj.email === '' ? undefined : obj.email,
    }),
    z
        .object({
            username: z.string().min(3, 'Username should be at least 3 characters long').optional(),
            email: z.email({ message: 'Invalid email address' }).optional(),
        })
        .refine((data) => data.username || data.email, {
            message: 'At least one of username or email must be provided',
            path: ['username', 'email'],
        }),
);

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
