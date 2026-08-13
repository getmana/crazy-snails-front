'use client';

import Image from 'next/image';
import React, { forwardRef } from 'react';

import { ErrorText } from '@/components';

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    preview: string | null;
};

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({ label, error, className = '', preview, ...props }, ref) => {
    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="file:bg-primary file:text-primary-foreground block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold hover:file:cursor-pointer hover:file:shadow-md"
                {...props}
            />
            {error && <ErrorText text={error} />}
            {preview && (
                <div className="bg-accent relative my-6 h-48 w-full max-w-sm overflow-hidden rounded-lg md:h-64 lg:h-72">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 512px"
                    />
                </div>
            )}
        </div>
    );
});

FileInput.displayName = 'FileInput';
