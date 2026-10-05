'use client';

import { PhotoUploadField } from '@/components/fields/PhotoUploadField/PhotoUploadField';
import { type ExistingPhoto } from '@/types';

type HeroPhotoUploadProps = {
    label: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const HeroPhotoUpload = (props: HeroPhotoUploadProps) => <PhotoUploadField max={1} {...props} />;
