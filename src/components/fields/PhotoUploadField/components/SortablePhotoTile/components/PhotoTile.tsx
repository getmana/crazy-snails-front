'use client';

import { GripVertical, Pencil, Star } from 'lucide-react';
import Image from 'next/image';

import { ErrorText } from '@/components/shared/ErrorText';
import { Icon } from '@/components/shared/Icon/Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type PhotoTileProps = {
    previewUrl: string;
    status: 'uploading' | 'done' | 'error';
    errorMessage?: string;
    retryable?: boolean;
    onRetry: () => void;
    onRemove: () => void;
    onEditCaption?: () => void;
    dragHandleRef?: (element: Element | null) => void;
    isCover?: boolean;
    editDisabledHint?: string;
};

export const PhotoTile = ({
    previewUrl,
    status,
    errorMessage,
    retryable = true,
    onRetry,
    onRemove,
    onEditCaption,
    dragHandleRef,
    isCover,
    editDisabledHint,
}: PhotoTileProps) => {
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
                    <div className="text-common-green absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-white">
                        {isCover ? <Star className="size-4" fill="currentColor" /> : <Icon icon="CheckCircle" className="size-5" />}
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
                {status === 'done' && onEditCaption && !editDisabledHint && (
                    <button
                        type="button"
                        onClick={onEditCaption}
                        aria-label="Edit caption"
                        className="text-muted-foreground hover:text-accent-foreground absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-white transition-colors"
                    >
                        <Pencil className="size-3" />
                    </button>
                )}
                {status === 'done' && onEditCaption && editDisabledHint && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} aria-label={editDisabledHint} className="absolute right-1 bottom-1 rounded-full">
                                <button
                                    type="button"
                                    disabled
                                    aria-hidden
                                    tabIndex={-1}
                                    className="text-muted-foreground/50 pointer-events-none flex size-5 items-center justify-center rounded-full bg-white"
                                >
                                    <Pencil className="size-3" />
                                </button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{editDisabledHint}</TooltipContent>
                    </Tooltip>
                )}
                {status === 'done' && dragHandleRef && (
                    <button
                        type="button"
                        ref={dragHandleRef}
                        aria-label="Drag to reorder"
                        className="text-muted-foreground hover:text-accent-foreground absolute bottom-1 left-1 flex size-5 cursor-grab items-center justify-center rounded-full bg-white transition-colors active:cursor-grabbing"
                    >
                        <GripVertical className="size-3" />
                    </button>
                )}
            </div>
            {status === 'error' && (
                <div className="mt-1">
                    <ErrorText text={errorMessage || 'Upload failed'} className="text-xs" />
                    {retryable && (
                        <button type="button" onClick={onRetry} className="text-sm underline">
                            Retry
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
