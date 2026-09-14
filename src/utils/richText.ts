import type { JSONContent } from '@tiptap/core';

import type { TiptapDocument } from '@/types/tiptap';

function extractNodeText(node: JSONContent): string {
    if (node.type === 'text') return node.text ?? '';
    return (node.content ?? []).map(extractNodeText).join(' ');
}

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

export function getTiptapTextPreview(doc: TiptapDocument | null | undefined, maxLength = 150): string {
    if (!doc?.content) return '';

    const text = doc.content.map(extractNodeText).join(' ').replace(/\s+/g, ' ').trim();

    return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`;
}
