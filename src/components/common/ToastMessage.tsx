'use client';

import { useEffect } from 'react';

import { type Dictionary, ToastType, useDictionary, useToastMessageContext } from '@/context';

type ToastKey = keyof Dictionary['toastMessages'];

type ToastMessageMapType = Record<string, { type: ToastType; key: ToastKey }>;

export const ToastMessageMap: ToastMessageMapType = {
    created: {
        type: 'success',
        key: 'albumCreated',
    },
    updated: {
        type: 'success',
        key: 'albumUpdated',
    },
};

export const ToastMessage = ({ toast }: { toast: keyof typeof ToastMessageMap }) => {
    const { setToastMessage } = useToastMessageContext();
    const { toastMessages } = useDictionary();

    useEffect(() => {
        const { type, key } = ToastMessageMap[toast];
        setToastMessage({ message: toastMessages[key], type });
    }, []);

    return <></>;
};
