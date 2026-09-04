'use client';

import Image from 'next/image';

import { ErrorText, Icon } from '@/components';

type PhotoTileProps = {
    previewUrl: string;
    status: 'uploading' | 'done' | 'error';
    errorMessage?: string;
    onRetry: () => void;
    onRemove: () => void;
};

export const PhotoTile = ({ previewUrl, status, errorMessage, onRetry, onRemove }: PhotoTileProps) => {
    return (
        <div className="w-40">
            <div className="bg-accent relative h-32 w-40 overflow-hidden rounded-lg">
                <Image src={previewUrl} alt="" fill className="object-cover" sizes="160px" />
                {status === 'uploading' && (
                    <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
                        <div className="border-foreground/30 border-t-foreground h-6 w-6 animate-spin rounded-full border-2" />
                    </div>
                )}
                {status === 'done' && (
                    <div className="text-common-green absolute top-1 right-1 flex rounded-full bg-white">
                        <Icon icon="CheckCircle" className="size-5" />
                    </div>
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Remove photo"
                    className="text-muted-foreground hover:text-accent-foreground absolute top-1 left-1 rounded-full bg-white transition-colors"
                >
                    <Icon icon="CloseCircle" className="size-5" />
                </button>
            </div>
            {status === 'error' && (
                <div className="mt-1">
                    <ErrorText text={errorMessage || 'Upload failed'} />
                    <button type="button" onClick={onRetry} className="text-sm underline">
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};
