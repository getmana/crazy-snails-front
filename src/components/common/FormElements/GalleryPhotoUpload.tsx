'use client';

import { type ExistingPhoto } from '@/hooks/usePhotoUpload';

import { PhotoUploadField } from './PhotoUploadField';

type GalleryPhotoUploadProps = {
    label: string;
    tip: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const GalleryPhotoUpload = (props: GalleryPhotoUploadProps) => <PhotoUploadField max={3} {...props} />;
