'use client';

import { useState, useTransition } from 'react';

import { deleteStoryWithRedirect } from '@/actions/deleteStory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDictionary, useToastMessageContext } from '@/context';

type DeleteStoryDialogProps = {
    storyId: number;
    trigger: React.ReactNode;
};

export const DeleteStoryDialog = ({ storyId, trigger }: DeleteStoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { setToastMessage } = useToastMessageContext();

    const {
        editStoryForm: { confirmDelete, deleteBtn, cancelBtn },
    } = useDictionary();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteStoryWithRedirect(storyId);
            if (result) {
                setToastMessage({ message: result, type: 'error' });
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{confirmDelete}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
                        {cancelBtn}
                    </Button>
                    <Button type="button" variant="destructive" disabled={isPending} onClick={handleDelete}>
                        {deleteBtn}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
