'use client';

import { useRef, useState } from 'react';

import { EditNoteDialog } from '@/components/album/EditNoteDialog/EditNoteDialog';
import { PhotoUploadField } from '@/components/fields/PhotoUploadField/PhotoUploadField';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';
import { type ExistingPhoto, type SelectOption } from '@/types';

type AlbumPhotoUploadValue = { photoIds: number[]; previewImageId: number | null };

type AlbumPhotoUploadProps = {
    albumId: number;
    label: string;
    locale: Locale;
    countries: SelectOption[];
    initialPhotos?: ExistingPhoto[];
    initialPreviewImageId: number | null;
    onChange: (value: AlbumPhotoUploadValue) => void;
};

export const AlbumPhotoUpload = ({
    albumId,
    label,
    locale,
    countries,
    initialPhotos,
    initialPreviewImageId,
    onChange,
}: AlbumPhotoUploadProps) => {
    const [photoIds, setPhotoIds] = useState<number[]>(() => initialPhotos?.map((photo) => photo.photoId) ?? []);
    const [explicitCoverPhotoId, setExplicitCoverPhotoId] = useState<number | null>(() =>
        initialPreviewImageId !== null && (initialPhotos ?? []).some((photo) => photo.photoId === initialPreviewImageId)
            ? initialPreviewImageId
            : null,
    );
    const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
    const {
        editAlbumForm: { noteUnsavedPhotoHint },
    } = useDictionary();

    const savedPhotoIds = initialPhotos?.map((photo) => photo.photoId) ?? [];

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const effectiveCoverPhotoId = explicitCoverPhotoId ?? photoIds[0] ?? null;

    const emit = (ids: number[], cover: number | null) => {
        onChangeRef.current({ photoIds: ids, previewImageId: cover });
    };

    const handlePhotoIdsChange = (ids: number[]) => {
        setPhotoIds(ids);

        const nextExplicit = explicitCoverPhotoId !== null && ids.includes(explicitCoverPhotoId) ? explicitCoverPhotoId : null;
        if (nextExplicit !== explicitCoverPhotoId) setExplicitCoverPhotoId(nextExplicit);
        emit(ids, nextExplicit ?? ids[0] ?? null);

        if (editingPhotoId !== null && !ids.includes(editingPhotoId)) {
            setEditingPhotoId(null);
        }
    };

    const handleNoteSaved = (photoId: number, isCover: boolean) => {
        const nextExplicit = isCover ? photoId : explicitCoverPhotoId === photoId ? null : explicitCoverPhotoId;
        setExplicitCoverPhotoId(nextExplicit);
        emit(photoIds, nextExplicit ?? photoIds[0] ?? null);
    };

    return (
        <>
            <PhotoUploadField
                max={500}
                label={label}
                initialPhotos={initialPhotos}
                onChange={handlePhotoIdsChange}
                onEditCaption={setEditingPhotoId}
                coverPhotoId={effectiveCoverPhotoId ?? undefined}
                editablePhotoIds={savedPhotoIds}
                editDisabledHint={noteUnsavedPhotoHint}
            />
            <EditNoteDialog
                key={editingPhotoId ?? 'none'}
                albumId={albumId}
                photoId={editingPhotoId}
                open={editingPhotoId !== null}
                locale={locale}
                countries={countries}
                initialIsCover={editingPhotoId !== null && editingPhotoId === effectiveCoverPhotoId}
                onOpenChange={(open) => !open && setEditingPhotoId(null)}
                onSaved={handleNoteSaved}
            />
        </>
    );
};
