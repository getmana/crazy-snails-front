'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';

import { ErrorText } from '@/components';
import { STORY_EMOJIS } from '@/constants/emojis';
import { tiptapExtensions } from '@/lib/tiptap';
import type { TiptapDocument } from '@/types/tiptap';

type RichTextEditorProps = {
    value: TiptapDocument | null;
    onChange: (doc: TiptapDocument | null) => void;
    label?: string;
    error?: string;
};

export const RichTextEditor = ({ value, onChange, label, error }: RichTextEditorProps) => {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: tiptapExtensions,
        content: value ?? undefined,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON() as TiptapDocument);
        },
    });

    useEffect(() => {
        if (!editor || editor.isDestroyed) return;
        const current = editor.getJSON();
        if (JSON.stringify(current) !== JSON.stringify(value)) {
            editor.commands.setContent(value ?? '');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setEmojiPickerOpen(false);
            }
        };
        if (emojiPickerOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [emojiPickerOpen]);

    const toggleMark = (mark: 'bold' | 'italic' | 'strike') => {
        if (!editor) return;
        if (mark === 'bold') editor.chain().focus().toggleBold().run();
        else if (mark === 'italic') editor.chain().focus().toggleItalic().run();
        else editor.chain().focus().toggleStrike().run();
    };

    const toggleLink = () => {
        if (!editor) return;
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
        } else {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const insertEmoji = (emoji: string) => {
        editor?.chain().focus().insertContent(emoji).run();
        setEmojiPickerOpen(false);
    };

    const isActive = (mark: string) => editor?.isActive(mark) ?? false;

    return (
        <div className="input-wrapper mb-4">
            {label && <label className="mb-1 block text-sm font-medium">{label}</label>}
            <div className="rounded-md border">
                <div className="flex flex-wrap gap-1 border-b px-2 py-1">
                    <ToolbarButton onClick={() => toggleMark('bold')} active={isActive('bold')} title="Bold">
                        <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => toggleMark('italic')} active={isActive('italic')} title="Italic">
                        <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => toggleMark('strike')} active={isActive('strike')} title="Strikethrough">
                        <s>S</s>
                    </ToolbarButton>
                    <ToolbarButton onClick={toggleLink} active={isActive('link')} title="Link">
                        🔗
                    </ToolbarButton>
                    <div className="relative" ref={emojiPickerRef}>
                        <ToolbarButton onClick={() => setEmojiPickerOpen((o) => !o)} active={emojiPickerOpen} title="Emoji">
                            😊
                        </ToolbarButton>
                        {emojiPickerOpen && (
                            <div className="absolute top-full left-0 z-50 mt-1 grid w-64 grid-cols-8 gap-0.5 rounded-md border bg-white p-2 shadow-lg dark:bg-gray-800">
                                {STORY_EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        className="rounded p-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => insertEmoji(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none px-3 py-2 focus-within:outline-none [&_.ProseMirror]:min-h-[80px] [&_.ProseMirror]:outline-none"
                />
            </div>
            {error && <ErrorText text={error} />}
        </div>
    );
};

type ToolbarButtonProps = {
    onClick: () => void;
    active: boolean;
    title: string;
    children: React.ReactNode;
};

const ToolbarButton = ({ onClick, active, title, children }: ToolbarButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`rounded px-2 py-0.5 text-sm transition-colors ${
            active ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);
