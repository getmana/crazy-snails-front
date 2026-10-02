'use client';

import { useId } from 'react';

import { ErrorText } from '@/components';
import { Checkbox as CheckboxPrimitive } from '@/components/ui/checkbox';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive> & {
    label?: string;
    error?: string;
};

export const Checkbox = ({ label, error, id, ...props }: CheckboxProps) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2">
                <CheckboxPrimitive id={checkboxId} {...props} />
                {label && (
                    <label htmlFor={checkboxId} className="text-sm font-medium">
                        {label}
                    </label>
                )}
            </div>
            {error && <ErrorText text={error} />}
        </div>
    );
};
