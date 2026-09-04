'use client';

import { type ExistingPhoto } from '@/hooks/usePhotoUpload';

import { PhotoUploadField } from './PhotoUploadField';

type HeroPhotoUploadProps = {
    label: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const HeroPhotoUpload = (props: HeroPhotoUploadProps) => <PhotoUploadField max={1} {...props} />;
