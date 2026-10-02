import { z } from 'zod';

const emptyToUndefined = (value: string | undefined) => (value === '' ? undefined : value);

export const EditUserSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username should be at least 3 characters long')
            .optional()
            .or(z.literal(''))
            .transform(emptyToUndefined),
        email: z.email({ message: 'Invalid email address' }).optional().or(z.literal('')).transform(emptyToUndefined),
    })
    .refine((data) => data.username || data.email, {
        message: 'At least one of username or email must be provided',
        path: ['username', 'email'],
    });

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
