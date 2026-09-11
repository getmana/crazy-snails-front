import type { TiptapDocument } from '@/types/tiptap';

export function isTiptapDocEmpty(doc: TiptapDocument | null | undefined): boolean {
    if (!doc) return true;
    return !JSON.stringify(doc).includes('"text"');
}

export function splitTiptapDocument(doc: TiptapDocument | null | undefined): [TiptapDocument | null, TiptapDocument | null] {
    const content = doc?.content;
    if (!doc || !content || content.length < 2) {
        return [doc ?? null, null];
    }

    const mid = Math.ceil(content.length / 2);
    return [
        { ...doc, content: content.slice(0, mid) },
        { ...doc, content: content.slice(mid) },
    ];
}
