import { z } from 'zod';

export const SignUpSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password should be at least 8 characters long'),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
