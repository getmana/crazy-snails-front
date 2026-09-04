'use client';

import { type ExistingPhoto } from '@/hooks/usePhotoUpload';

import { PhotoUploadField } from './PhotoUploadField';

type CarouselPhotoUploadProps = {
    label: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const CarouselPhotoUpload = (props: CarouselPhotoUploadProps) => <PhotoUploadField max={15} {...props} />;
