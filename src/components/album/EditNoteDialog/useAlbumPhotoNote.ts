import { useEffect, useState } from 'react';

import { getAlbumPhotoNote } from '@/actions/getAlbumPhotoNote';
import { type AlbumPhotoNote } from '@/types';

type AlbumPhotoNoteState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; note: AlbumPhotoNote | null };

export const useAlbumPhotoNote = (albumId: number, photoId: number | null) => {
    const [state, setState] = useState<AlbumPhotoNoteState>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (photoId === null) return;

        let stale = false;

        getAlbumPhotoNote(albumId, photoId).then((result) => {
            if (stale) return;
            setState('error' in result ? { status: 'error', message: result.error } : { status: 'ready', note: result.note });
        });

        return () => {
            stale = true;
        };
    }, [albumId, photoId, attempt]);

    const retry = () => {
        setState({ status: 'loading' });
        setAttempt((current) => current + 1);
    };

    return { state, retry };
};
