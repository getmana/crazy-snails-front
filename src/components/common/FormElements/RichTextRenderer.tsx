'use client';

import { EditorContent, useEditor } from '@tiptap/react';

import { tiptapExtensions } from '@/lib/tiptap';
import type { TiptapDocument } from '@/types/tiptap';

type RichTextRendererProps = {
    content: TiptapDocument | null;
    className?: string;
};

export const RichTextRenderer = ({ content, className = '' }: RichTextRendererProps) => {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: content ?? undefined,
        editable: false,
        immediatelyRender: false,
    });

    if (!content) return null;

    return <EditorContent editor={editor} className={`prose prose-sm max-w-none [&_.ProseMirror]:outline-none ${className}`} />;
};
