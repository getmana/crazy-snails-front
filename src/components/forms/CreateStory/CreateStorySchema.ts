import { z } from 'zod';

export const CreateStorySchema = z
    .object({
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    });

export type CreateStorySchemaType = z.infer<typeof CreateStorySchema>;
