import { z } from 'zod';

export const CreateAlbumSchema = z.object({
    title: z.string().min(1, 'Title must be at least 1 character'),
    description: z.string(),
    countries: z
        .array(z.object({ code: z.string() }))
        .min(1, 'At least one country field is required')
        .max(5, 'Maximum 5 countries allowed')
        .refine((countries) => countries.some((c) => c.code.length > 0), {
            message: 'At least one country must be selected',
        }),
    startDate: z.date(),
    endDate: z.date(),
});

export type CreateAlbumSchemaType = z.infer<typeof CreateAlbumSchema>;
