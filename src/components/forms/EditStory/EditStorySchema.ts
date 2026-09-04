import { z } from 'zod';

export const EditStorySchema = z
    .object({
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionUk: z.string().optional(),
        heroFirst: z.boolean(),
        heroPhotoIds: z.number().optional(),
        pairPhotoIds: z.array(z.number()),
        galleryPhotoIds: z.array(z.number()),
        carouselPhotoIds: z.array(z.number()),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    });

export type EditStorySchemaType = z.infer<typeof EditStorySchema>;
