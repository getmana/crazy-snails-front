import { Photo } from './photo';
import type { TiptapDocument } from './tiptap';

export type AlbumPhotoNote = {
    id: number;
    title: string | null;
    titleEn: string | null;
    titleUk: string | null;
    description: TiptapDocument;
    descriptionEn: TiptapDocument | null;
    descriptionUk: TiptapDocument | null;
    countryId: number | null;
    date: string | null;
};

export type AlbumNoteValues = {
    titleEn?: string | null;
    titleUk?: string | null;
    descriptionEn?: TiptapDocument | null;
    descriptionUk?: TiptapDocument | null;
    countryId?: number | null;
    date?: string | null;
};

export type AlbumPhotoJoin = {
    photoId: number;
    position: number;
    photo: Photo & { notes: AlbumPhotoNote[] };
};

export type AlbumCountry = {
    countryId: number;
    position: number;
    country: { id: number; code: string; nameEn: string; nameUk: string };
};

export type AlbumActivity = {
    activityType: string;
};

export type Album = {
    id: number;
    userId: number;
    title: string;
    titleEn: string | null;
    titleUk: string | null;
    subtitle?: string;
    subtitleEn?: string;
    subtitleUk?: string;
    description: TiptapDocument | null;
    descriptionEn: TiptapDocument | null;
    descriptionUk: TiptapDocument | null;
    createdAt: Date;
    updatedAt: Date;
    previewImageId: number | null;
    photo: Photo | null;
    isPublished: boolean;
    startDate: string;
    endDate: string;
    countries: AlbumCountry[];
    activities: AlbumActivity[];
    photos: AlbumPhotoJoin[];
};

export type OwnAlbumsResponse = {
    items: Omit<Album, 'photos' | 'countries' | 'activities'>[];
    nextCursor: number | null;
};

export type PublicAlbumsResponse = {
    items: Omit<Album, 'photos' | 'countries' | 'activities'>[];
    nextCursor: number | null;
};
