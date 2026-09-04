import { useCallback, useState } from 'react';

import { uploadPhoto } from '@/api/uploadPhoto';
import { runWithConcurrencyLimit } from '@/utils';

const UPLOAD_CONCURRENCY_LIMIT = 4;

export type PhotoUploadItem = {
    tempId: string;
    file?: File;
    previewUrl: string;
    status: 'uploading' | 'done' | 'error';
    photoId?: number;
    errorMessage?: string;
};

export type ExistingPhoto = {
    photoId: number;
    url: string;
};

export const usePhotoUpload = (max: number, initialPhotos: ExistingPhoto[] = []) => {
    const [items, setItems] = useState<PhotoUploadItem[]>(() =>
        initialPhotos.map((photo) => ({
            tempId: `existing-${photo.photoId}`,
            previewUrl: photo.url,
            status: 'done',
            photoId: photo.photoId,
        })),
    );

    const upload = useCallback(async (item: PhotoUploadItem) => {
        if (!item.file) return;
        const result = await uploadPhoto(item.file);

        setItems((current) =>
            current.map((existing) =>
                existing.tempId === item.tempId
                    ? 'error' in result
                        ? { ...existing, status: 'error', errorMessage: result.error }
                        : { ...existing, status: 'done', photoId: result.photoId }
                    : existing,
            ),
        );
    }, []);

    const addFiles = useCallback(
        (files: File[]) => {
            const availableSlots = max - items.length;
            if (availableSlots <= 0) return;

            const newItems: PhotoUploadItem[] = files.slice(0, availableSlots).map((file) => ({
                tempId: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
                previewUrl: URL.createObjectURL(file),
                status: 'uploading',
            }));

            setItems((current) => [...current, ...newItems]);
            runWithConcurrencyLimit(newItems, UPLOAD_CONCURRENCY_LIMIT, upload);
        },
        [items.length, max, upload],
    );

    const retry = useCallback(
        (tempId: string) => {
            const item = items.find((existing) => existing.tempId === tempId);
            if (!item || !item.file) return;

            setItems((current) =>
                current.map((existing) => (existing.tempId === tempId ? { ...existing, status: 'uploading' } : existing)),
            );
            upload({ ...item, status: 'uploading' });
        },
        [items, upload],
    );

    const remove = useCallback((tempId: string) => {
        setItems((current) => {
            const item = current.find((existing) => existing.tempId === tempId);
            if (item?.file) URL.revokeObjectURL(item.previewUrl);
            return current.filter((existing) => existing.tempId !== tempId);
        });
    }, []);

    const photoIds = items.filter((item) => item.status === 'done').map((item) => item.photoId!);

    return { items, addFiles, retry, remove, photoIds, max };
};
