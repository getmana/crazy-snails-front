import type { PhotoStatus } from './api';

export type StoryPhoto = {
    id: number;
    originalKey: string;
    thumbnailSmKey: string | null;
    thumbnailMdKey: string | null;
    status: PhotoStatus;
};

export type StoryPhotoJoin = {
    photoId: number;
    position: number;
    photo: StoryPhoto;
};

export type Story = {
    id: number;
    userId: number;
    heroImageId: number | null;
    title: string;
    titleEn: string | null;
    titleUk: string | null;
    description: string | null;
    descriptionEn: string | null;
    descriptionUk: string | null;
    heroFirst: boolean;
    isPublished: boolean;
    photo: StoryPhoto | null;
    pairImageStories: StoryPhotoJoin[];
    galleryImageStories: StoryPhotoJoin[];
    carouselStories: StoryPhotoJoin[];
};
