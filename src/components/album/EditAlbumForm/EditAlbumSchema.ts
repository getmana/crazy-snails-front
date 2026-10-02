import { z } from 'zod';

import { TiptapDocumentSchema } from '@/components/fields/tiptapDocumentSchema';

export const EditAlbumSchema = z
    .object({
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleUk: z.string().optional(),
        descriptionEn: TiptapDocumentSchema,
        descriptionUk: TiptapDocumentSchema,
        countries: z
            .array(z.object({ code: z.string() }))
            .min(1, 'At least one country field is required')
            .max(5, 'Maximum 5 countries allowed')
            .refine((countries) => countries.some((c) => c.code.length > 0), {
                message: 'At least one country must be selected',
            }),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
        activityTypes: z.array(z.string()).min(1, 'At least one activity type is required'),
        photos: z.object({
            photoIds: z.array(z.number()),
            previewImageId: z.number().nullable(),
        }),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    });

export type EditAlbumSchemaType = z.infer<typeof EditAlbumSchema>;
