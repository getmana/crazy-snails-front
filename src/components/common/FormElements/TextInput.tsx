'use client';

import React, { forwardRef } from 'react';

import { ErrorText } from '@/components';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="input-wrapper relative">
            {label && <label>{label}</label>}
            <input ref={ref} className={`w-full rounded-md border px-3 py-2 ${className}`} {...props} />
            {error && <ErrorText text={error} />}
        </div>
    );
});

TextInput.displayName = 'TextInput';
