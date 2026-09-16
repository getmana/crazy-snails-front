'use client';

import { useRef, useState } from 'react';

import { type ExistingPhoto } from '@/hooks/usePhotoUpload';
import { type CarouselPhotoInput } from '@/types';
import { getLocaleFromCookie } from '@/utils';

import { CaptionEditDialog } from './CaptionEditDialog';
import { PhotoUploadField } from './PhotoUploadField';

type CarouselCaptionMap = Record<number, { caption?: string; captionEn?: string; captionUk?: string }>;

type CarouselPhotoUploadProps = {
    label: string;
    initialPhotos?: ExistingPhoto[];
    initialCaptions?: CarouselPhotoInput[];
    onChange: (photos: CarouselPhotoInput[]) => void;
};

export const CarouselPhotoUpload = ({ label, initialPhotos, initialCaptions, onChange }: CarouselPhotoUploadProps) => {
    const [photoIds, setPhotoIds] = useState<number[]>(() => initialPhotos?.map((photo) => photo.photoId) ?? []);
    const [captions, setCaptions] = useState<CarouselCaptionMap>(() =>
        Object.fromEntries(
            (initialCaptions ?? []).map(({ photoId, caption, captionEn, captionUk }) => [photoId, { caption, captionEn, captionUk }]),
        ),
    );
    const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
    const preferredLocale = getLocaleFromCookie();

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const emit = (ids: number[], caps: CarouselCaptionMap) => {
        onChangeRef.current(ids.map((photoId) => ({ photoId, ...caps[photoId] })));
    };

    const handlePhotoIdsChange = (ids: number[]) => {
        setPhotoIds(ids);
        setCaptions((current) => {
            const next: CarouselCaptionMap = {};
            for (const id of ids) next[id] = current[id] ?? {};
            emit(ids, next);
            return next;
        });
        if (editingPhotoId !== null && !ids.includes(editingPhotoId)) {
            setEditingPhotoId(null);
        }
    };

    const handleSaveCaption = (captionEn: string, captionUk: string) => {
        if (editingPhotoId === null) return;
        setCaptions((current) => {
            const caption = preferredLocale === 'en' ? captionEn : captionUk;
            const next = { ...current, [editingPhotoId]: { caption, captionEn, captionUk } };
            emit(photoIds, next);
            return next;
        });
        setEditingPhotoId(null);
    };

    return (
        <>
            <PhotoUploadField
                max={15}
                label={label}
                initialPhotos={initialPhotos}
                onChange={handlePhotoIdsChange}
                onEditCaption={setEditingPhotoId}
            />
            <CaptionEditDialog
                key={editingPhotoId ?? 'none'}
                open={editingPhotoId !== null}
                initialCaptionEn={editingPhotoId !== null ? captions[editingPhotoId]?.captionEn : undefined}
                initialCaptionUk={editingPhotoId !== null ? captions[editingPhotoId]?.captionUk : undefined}
                onOpenChange={(open) => !open && setEditingPhotoId(null)}
                onSave={handleSaveCaption}
            />
        </>
    );
};
