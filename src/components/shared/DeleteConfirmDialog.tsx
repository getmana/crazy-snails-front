'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToastMessageContext } from '@/context';

type DeleteConfirmDialogProps = {
    trigger: React.ReactNode;
    action: () => Promise<string | undefined>;
    title: string;
    confirmLabel: string;
    cancelLabel: string;
};

export const DeleteConfirmDialog = ({ trigger, action, title, confirmLabel, cancelLabel }: DeleteConfirmDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { setToastMessage } = useToastMessageContext();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await action();
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
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
                        {cancelLabel}
                    </Button>
                    <Button type="button" variant="destructive" disabled={isPending} onClick={handleDelete}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
