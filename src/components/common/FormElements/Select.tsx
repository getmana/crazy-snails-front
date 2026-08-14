'use client';

import { forwardRef } from 'react';

import { ErrorText } from '@/components';

export type SelectOption = {
    id: number;
    name: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    className?: string;
    options: SelectOption[];
    placeholder: string;
    value?: string;
    onChange?: (value: string) => void;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className = '', options, placeholder, value, onChange, ...props }, ref) => {
        return (
            <div className="input-wrapper">
                {label && <label className="mb-1 block">{label}</label>}
                <select
                    ref={ref}
                    className={`w-full rounded-md border px-3 py-2 outline-none ${className} appearance-none`}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map(({ id, name }) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
                {error && <ErrorText text={error} />}
            </div>
        );
    },
);

Select.displayName = 'Select';
