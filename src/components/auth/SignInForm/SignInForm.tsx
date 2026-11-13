'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { readErrorResponse } from '@/api/readErrorResponse';
import { PasswordInput } from '@/components/fields/PasswordInput';
import { TextInput } from '@/components/fields/TextInput';
import { ADMIN_THEME_STORAGE_KEY } from '@/components/layout/AdminThemeProvider';
import { API_ERROR_CODES } from '@/constants';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { type AdminTheme } from '@/types';
import { getApiErrorMessage, internalAPIRoutes } from '@/utils';

import { SignInSchema, SignInSchemaType } from './SignInSchema';

type SignInFormProps = { locale: Locale };

export const SignInForm = ({ locale }: SignInFormProps) => {
    const {
        apiErrors,
        authForms,
        button,
        systemMessages: { signedIn },
    } = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [isRedirecting, setIsRedirecting] = useState(false);
    const { setToastMessage } = useToastMessageContext();
    const router = useRouter();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInSchemaType>({
        resolver: zodResolver(SignInSchema),
    });

    const disableForm = isLoading;

    const onSubmit = async (data: SignInSchemaType) => {
        setIsLoading(true);
        reset();
        console.log('===================', JSON.stringify(data));
        try {
            const res = await fetch(internalAPIRoutes.signin, { body: JSON.stringify(data), method: 'POST' });
            if (!res.ok) {
                const error = await readErrorResponse(res);
                setToastMessage({ message: getApiErrorMessage(error, apiErrors), type: 'error' });
            } else {
                const response = await res.json();
                setToastMessage({ message: signedIn, type: 'success' });

                const adminTheme = response.adminTheme as AdminTheme | undefined;
                if (adminTheme) {
                    localStorage.setItem(ADMIN_THEME_STORAGE_KEY, adminTheme);
                }

                router.push(`/${locale}/dashboard`);
            }
        } catch {
            setToastMessage({ message: apiErrors[API_ERROR_CODES.UNEXPECTED_ERROR], type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center pb-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    type="email"
                    label={authForms.email}
                    disabled={disableForm}
                    error={errors.email?.message}
                    {...register('email')}
                    autoComplete="email"
                />
                <PasswordInput
                    label={authForms.password}
                    disabled={disableForm}
                    error={errors.password?.message}
                    {...register('password')}
                    autoComplete="password"
                />
                <button className="btn-primary" type="submit" disabled={disableForm}>
                    {button.signin}
                </button>
            </form>
        </div>
    );
};
