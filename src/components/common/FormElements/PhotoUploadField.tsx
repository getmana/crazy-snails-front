'use client';

import { useEffect, useRef } from 'react';

import { type ExistingPhoto, usePhotoUpload } from '@/hooks/usePhotoUpload';

import { FileInput } from './FileInput';
import { PhotoTile } from './PhotoTile';

type PhotoUploadFieldProps = {
    max: number;
    label: string;
    tip?: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
};

export const PhotoUploadField = ({ max, label, tip, initialPhotos, onChange }: PhotoUploadFieldProps) => {
    const { items, addFiles, retry, remove, photoIds } = usePhotoUpload(max, initialPhotos);

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        onChangeRef.current(photoIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photoIds.join(',')]);

    const showTip = !!tip && photoIds.length > 0 && photoIds.length < max;

    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium">{label}</label>
            {items.length < max && <FileInput multiple preview={null} onFilesSelected={addFiles} />}
            {showTip && <p className="text-foreground mb-2 text-sm">{tip}</p>}
            <div className="flex flex-wrap gap-3">
                {items.map((item) => (
                    <PhotoTile
                        key={item.tempId}
                        previewUrl={item.previewUrl}
                        status={item.status}
                        errorMessage={item.errorMessage}
                        retryable={item.retryable}
                        onRetry={() => retry(item.tempId)}
                        onRemove={() => remove(item.tempId)}
                    />
                ))}
            </div>
        </div>
    );
};
