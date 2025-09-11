'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components';
import { ToastType, useToastMessageContext } from '@/context/toast-message-context';

const TOAST_DURATION = 3000;

const ToastClassMap: Record<ToastType, string> = {
    warning: 'bg-warning',
    success: 'bg-common-green',
    error: 'bg-error',
};

export const ToastMessageWrapper = ({ children }: { children: React.ReactNode }) => {
    const { toastMessage, setToastMessage } = useToastMessageContext();
    const [animationClass, setAnimationClass] = useState<string>('');

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAnimationEnd = () => {
        if (animationClass === 'animate-toast-out') {
            setToastMessage(null);
        }
    };

    useEffect(() => {
        if (toastMessage?.message) {
            setAnimationClass('animate-toast-in');
            timerRef.current = setTimeout(() => setAnimationClass('animate-toast-out'), TOAST_DURATION);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [toastMessage]);

    return (
        <div>
            {children}
            {toastMessage ? (
                <div
                    onAnimationEnd={handleAnimationEnd}
                    className={`${animationClass} ${ToastClassMap[toastMessage.type]} fixed right-6 bottom-6 max-w-3/4 rounded-lg text-white shadow-lg`}
                >
                    <div className="relative py-3 pr-8 pl-4">
                        <span>{toastMessage.message}</span>
                        <button
                            onClick={() => setAnimationClass('animate-toast-out')}
                            className="absolute top-1 right-1 text-white/70 transition-colors hover:text-white"
                        >
                            <Icon icon="CloseCircle" className="size-5" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
