import { Photo } from './photo';

export type AlbumPhotoJoin = {
    photoId: number;
    position: number;
    photo: Photo;
};

export type Album = {
    id: number;
    userId: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    descriptionEn: string | null;
    descriptionUk: string | null;
    titleEn: string | null;
    titleUk: string | null;
    subtitle?: string;
    subtitleEn?: string;
    subtitleUk?: string;
    previewImageId: number | null;
    photo: Photo;
    isPublished: boolean;
    albumPhotos: AlbumPhotoJoin[];
};

export type OwnAlbumsResponse = {
    items: Omit<Album, 'albumPhotos'>[];
    nextCursor: number | null;
};

export type PublicAlbumsResponse = {
    items: Omit<Album, 'albumPhotos'>[];
    nextCursor: number | null;
};
