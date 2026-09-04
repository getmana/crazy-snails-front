'use client';

import { type ExistingPhoto } from '@/hooks/usePhotoUpload';

import { PhotoUploadField } from './PhotoUploadField';

type PairPhotoUploadProps = {
    label: string;
    tip: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const PairPhotoUpload = (props: PairPhotoUploadProps) => <PhotoUploadField max={2} {...props} />;
