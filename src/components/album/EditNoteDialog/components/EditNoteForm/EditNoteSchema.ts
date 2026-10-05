import { z } from 'zod';

import { TiptapDocumentSchema } from '@/components/fields/TiptapDocumentSchema';

export const EditNoteSchema = z.object({
    titleEn: z.string().optional(),
    titleUk: z.string().optional(),
    descriptionEn: TiptapDocumentSchema,
    descriptionUk: TiptapDocumentSchema,
    country: z.string().optional(),
    date: z.string().optional(),
});

export type EditNoteSchemaType = z.infer<typeof EditNoteSchema>;
