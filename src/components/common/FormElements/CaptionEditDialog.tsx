'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDictionary } from '@/context/dictionary-context';

import { TextInput } from './TextInput';

type CaptionEditDialogProps = {
    open: boolean;
    initialCaptionEn?: string;
    initialCaptionUk?: string;
    onOpenChange: (open: boolean) => void;
    onSave: (captionEn: string, captionUk: string) => void;
};

export const CaptionEditDialog = ({ open, initialCaptionEn, initialCaptionUk, onOpenChange, onSave }: CaptionEditDialogProps) => {
    const [captionEn, setCaptionEn] = useState(initialCaptionEn ?? '');
    const [captionUk, setCaptionUk] = useState(initialCaptionUk ?? '');

    const {
        editStoryForm: { captionDialogTitle, captionEnLabel, captionUkLabel, captionSaveBtn, captionCancelBtn },
    } = useDictionary();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{captionDialogTitle}</DialogTitle>
                </DialogHeader>
                <TextInput label={captionEnLabel} value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} />
                <TextInput label={captionUkLabel} value={captionUk} onChange={(e) => setCaptionUk(e.target.value)} />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {captionCancelBtn}
                    </Button>
                    <Button type="button" onClick={() => onSave(captionEn, captionUk)}>
                        {captionSaveBtn}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
