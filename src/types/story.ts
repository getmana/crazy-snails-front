import type { PhotoStatus } from './api';

export type StoryPhoto = {
    id: number;
    original_key: string;
    thumbnail_sm_key: string | null;
    thumbnail_md_key: string | null;
    status: PhotoStatus;
};

export type StoryPhotoJoin = {
    photo_id: number;
    position: number;
    photo: StoryPhoto;
};

export type Story = {
    id: number;
    user_id: number;
    hero_image_id: number | null;
    title: string;
    title_en: string | null;
    title_uk: string | null;
    description: string | null;
    description_en: string | null;
    description_uk: string | null;
    hero_first: boolean;
    is_published: boolean;
    photo: StoryPhoto | null;
    pair_image_stories: StoryPhotoJoin[];
    gallery_image_stories: StoryPhotoJoin[];
    carousel_stories: StoryPhotoJoin[];
};
