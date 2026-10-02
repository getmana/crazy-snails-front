import { z } from 'zod';

import { TiptapDocumentSchema } from '@/components/fields/tiptapDocumentSchema';

export const EditStorySchema = z
    .object({
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleUk: z.string().optional(),
        descriptionEn: TiptapDocumentSchema,
        descriptionUk: TiptapDocumentSchema,
        heroFirst: z.boolean(),
        heroPhotoIds: z.number().optional(),
        pairPhotoIds: z.array(z.number()),
        galleryPhotoIds: z.array(z.number()),
        carouselPhotos: z.array(
            z.object({
                photoId: z.number(),
                caption: z.string().optional(),
                captionEn: z.string().optional(),
                captionUk: z.string().optional(),
            }),
        ),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    });

export type EditStorySchemaType = z.infer<typeof EditStorySchema>;
