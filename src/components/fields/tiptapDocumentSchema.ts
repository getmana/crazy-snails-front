import { z } from 'zod';
import type { JSONContent } from '@tiptap/core';

import { TiptapDocument } from '@/types';

export const TiptapDocumentSchema = z
    .object({ type: z.literal('doc'), content: z.array(z.custom<JSONContent>()) })
    .optional()
    .nullable();

export const EMPTY_DOC: TiptapDocument = { type: 'doc', content: [] };
