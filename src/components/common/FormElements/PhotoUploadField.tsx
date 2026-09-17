'use client';

import { useEffect, useRef } from 'react';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';

import { type ExistingPhoto, usePhotoUpload } from '@/hooks/usePhotoUpload';

import { FileInput } from './FileInput';
import { SortablePhotoTile } from './SortablePhotoTile';

type PhotoUploadFieldProps = {
    max: number;
    label: string;
    tip?: string;
    initialPhotos?: ExistingPhoto[];
    onChange: (photoIds: number[]) => void;
    onEditCaption?: (photoId: number) => void;
};

export const PhotoUploadField = ({ max, label, tip, initialPhotos, onChange, onEditCaption }: PhotoUploadFieldProps) => {
    const { items, addFiles, retry, remove, reorder, photoIds } = usePhotoUpload(max, initialPhotos);

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
            <DragDropProvider
                onDragEnd={(event) => {
                    if (event.canceled) return;
                    reorder(
                        move(
                            items.map((item) => item.tempId),
                            event,
                        ),
                    );
                }}
            >
                <div className="flex flex-wrap gap-3">
                    {items.map((item, index) => (
                        <SortablePhotoTile
                            key={item.tempId}
                            tempId={item.tempId}
                            index={index}
                            disabled={item.status !== 'done' || items.length <= 1}
                            previewUrl={item.previewUrl}
                            status={item.status}
                            errorMessage={item.errorMessage}
                            retryable={item.retryable}
                            onRetry={() => retry(item.tempId)}
                            onRemove={() => remove(item.tempId)}
                            onEditCaption={onEditCaption && item.photoId !== undefined ? () => onEditCaption(item.photoId!) : undefined}
                        />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    );
};
