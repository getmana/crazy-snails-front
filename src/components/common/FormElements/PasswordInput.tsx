'use client';

import React, { forwardRef, useState } from 'react';

import { ErrorText, Icon } from '@/components';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label = 'Password', error, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="input-wrapper relative">
                {label && <label>{label}</label>}
                <input
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full rounded-md border px-3 py-2 pr-10 ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-8 right-2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    <Icon icon={showPassword ? 'EyeOff' : 'Eye'} className="size-5" />
                </button>
                {error && <ErrorText text={error} />}
            </div>
        );
    },
);

PasswordInput.displayName = 'PasswordInput';
