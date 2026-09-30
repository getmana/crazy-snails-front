'use client';

import React, { createContext, useContext, useState } from 'react';

export type ToastType = 'success' | 'warning' | 'error';

type ToastMessage = { message: string; type: ToastType } | null;

type ToastMessageContextType = {
    toastMessage: ToastMessage | null;
    setToastMessage: React.Dispatch<React.SetStateAction<ToastMessage | null>>;
};

const ToastMessageContext = createContext<ToastMessageContextType | null>(null);

export function ToastMessageProvider({ children }: { children: React.ReactNode }) {
    const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

    return <ToastMessageContext.Provider value={{ toastMessage, setToastMessage }}>{children}</ToastMessageContext.Provider>;
}

export function useToastMessageContext() {
    const context = useContext(ToastMessageContext);
    if (!context) {
        throw new Error('useToastMessageContext hook must be used within ToastMessageProvider');
    }

    return context;
}
