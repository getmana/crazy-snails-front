import { Photo } from './photo';

export type Album = {
    id: number;
    userId: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    descriptioEn: string | null;
    descriptionUk: string | null;
    titleEn: string | null;
    titleUk: string | null;
    previewImageId: number | null;
    photo: Photo;
};

export type OwnAlbumsResponse = {
    items: Album[];
    nextCursor: number | null;
};
