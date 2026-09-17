'use client';

import { useSortable } from '@dnd-kit/react/sortable';

import { PhotoTile } from './PhotoTile';

type SortablePhotoTileProps = {
    tempId: string;
    index: number;
    disabled: boolean;
    previewUrl: string;
    status: 'uploading' | 'done' | 'error';
    errorMessage?: string;
    retryable?: boolean;
    onRetry: () => void;
    onRemove: () => void;
    onEditCaption?: () => void;
};

export const SortablePhotoTile = ({ tempId, index, disabled, ...tileProps }: SortablePhotoTileProps) => {
    const { ref, handleRef, isDragging } = useSortable({ id: tempId, index, disabled });

    return (
        <div ref={ref} className={isDragging ? 'opacity-50' : undefined}>
            <PhotoTile {...tileProps} dragHandleRef={disabled ? undefined : handleRef} />
        </div>
    );
};
