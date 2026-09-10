import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';

export const tiptapExtensions = [StarterKit, Link.configure({ openOnClick: false })];
