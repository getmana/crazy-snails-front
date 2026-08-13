import { z } from 'zod';

export const CreateAlbumSchema = z
    .object({
        // title: z.string().min(1, 'Title must be at least 1 character'),
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
        // description: z.string(),
        descriptionEn: z.string().optional(),
        descriptionUk: z.string().optional(),
        countries: z
            .array(z.object({ code: z.string() }))
            .min(1, 'At least one country field is required')
            .max(5, 'Maximum 5 countries allowed')
            .refine((countries) => countries.some((c) => c.code.length > 0), {
                message: 'At least one country must be selected',
            }),
        startDate: z.date(),
        endDate: z.date(),
        activityTypes: z.array(z.string()).min(1, 'At least one activity type is required'),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    })
    .refine((data) => data.descriptionEn || data.descriptionUk, {
        message: 'At least one of descriptionEn or descriptionUk must be provided',
        path: ['descriptionEn', 'descriptionUk'],
    });

export type CreateAlbumSchemaType = z.infer<typeof CreateAlbumSchema>;
