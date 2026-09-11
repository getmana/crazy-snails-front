import type { PhotoStatus } from './api';

export type Photo = {
    id: number;
    originalKey: string;
    thumbnailSmKey: string | null;
    thumbnailMdKey: string | null;
    status: PhotoStatus;
};
