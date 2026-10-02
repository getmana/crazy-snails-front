'use client';

import { PhotoUploadField } from '@/components/fields/PhotoUploadField/PhotoUploadField';
import { type ExistingPhoto } from '@/components/fields/PhotoUploadField/usePhotoUpload';

type PairPhotoUploadProps = {
    label: string;
    tip: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const PairPhotoUpload = (props: PairPhotoUploadProps) => <PhotoUploadField max={2} {...props} />;
