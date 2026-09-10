import type { TiptapDocument } from '@/types/tiptap';

export function isTiptapDocEmpty(doc: TiptapDocument | null | undefined): boolean {
    if (!doc) return true;
    return !JSON.stringify(doc).includes('"text"');
}
