import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[\W_]/, 'Must contain a special character'),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
