'use client';

import { useState } from 'react';

import { Checkbox, EditNoteForm, ErrorText } from '@/components';
import { type SelectOption } from '@/components/common/FormElements/Select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDictionary } from '@/context';
import { useAlbumPhotoNote } from '@/hooks/useAlbumPhotoNote';
import { Locale } from '@/i18n-config';

type EditNoteDialogProps = {
    albumId: number;
    photoId: number | null;
    open: boolean;
    locale: Locale;
    countries: SelectOption[];
    initialIsCover: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: (photoId: number, isCover: boolean) => void;
};

export const EditNoteDialog = ({
    albumId,
    photoId,
    open,
    locale,
    countries,
    initialIsCover,
    onOpenChange,
    onSaved,
}: EditNoteDialogProps) => {
    const [isCover, setIsCover] = useState(initialIsCover);
    const { state, retry } = useAlbumPhotoNote(albumId, photoId);
    const {
        editNoteForm: { noteDialogTitle, coverCheckboxLabel },
        errorPage: { retryBtn },
    } = useDictionary();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{noteDialogTitle}</DialogTitle>
                </DialogHeader>
                <Checkbox label={coverCheckboxLabel} checked={isCover} onCheckedChange={(checked) => setIsCover(checked === true)} />
                {photoId !== null && state.status === 'loading' && (
                    <div className="space-y-4">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}
                {photoId !== null && state.status === 'error' && (
                    <div className="space-y-2">
                        <ErrorText text={state.message} />
                        <Button type="button" variant="outline" onClick={retry}>
                            {retryBtn}
                        </Button>
                    </div>
                )}
                {photoId !== null && state.status === 'ready' && (
                    <EditNoteForm
                        albumId={albumId}
                        photoId={photoId}
                        locale={locale}
                        countries={countries}
                        initialNote={state.note ?? undefined}
                        onCancel={() => onOpenChange(false)}
                        onSaved={() => {
                            onSaved(photoId, isCover);
                            onOpenChange(false);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
