import { z } from 'zod';

export const SignUpSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number')
        .regex(/[\W_]/, 'Password must contain a special character'),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
