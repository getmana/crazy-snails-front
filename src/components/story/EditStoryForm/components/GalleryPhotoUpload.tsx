'use client';

import { PhotoUploadField } from '@/components/fields/PhotoUploadField/PhotoUploadField';
import { type ExistingPhoto } from '@/types';

type GalleryPhotoUploadProps = {
    label: string;
    tip: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const GalleryPhotoUpload = (props: GalleryPhotoUploadProps) => <PhotoUploadField max={3} {...props} />;
