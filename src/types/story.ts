import type { PhotoStatus } from './api';
import { Photo } from './photo';
import type { TiptapDocument } from './tiptap';

export type StoryPhotoJoin = {
    photoId: number;
    position: number;
    photo: Photo;
};

export type CarouselPhotoJoin = StoryPhotoJoin & {
    caption?: string;
    captionEn?: string;
    captionUk?: string;
};

export type CarouselPhotoInput = {
    photoId: number;
    caption?: string;
    captionEn?: string;
    captionUk?: string;
};

export type Story = {
    id: number;
    userId: number;
    heroImageId: number | null;
    title: string;
    titleEn: string | null;
    titleUk: string | null;
    subtitle?: string;
    subtitleEn?: string;
    subtitleUk?: string;
    description: TiptapDocument | null;
    descriptionEn: TiptapDocument | null;
    descriptionUk: TiptapDocument | null;
    heroFirst: boolean;
    isPublished: boolean;
    photo: Photo | null;
    pairImageStories: StoryPhotoJoin[];
    galleryImageStories: StoryPhotoJoin[];
    carouselStories: CarouselPhotoJoin[];
};

export type OwnStoriesResponse = {
    items: Omit<Story, 'pairImageStories' | 'galleryImageStories' | 'carouselStories'>[];
    nextCursor: number | null;
};

export type PublicStoriesResponse = {
    items: Omit<Story, 'pairImageStories' | 'galleryImageStories' | 'carouselStories'>[];
    nextCursor: number | null;
};
