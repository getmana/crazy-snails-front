'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PasswordInput, TextInput } from '@/components';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { getErrorMessage, internalAPIRoutes } from '@/utils';

import { SignInSchema, SignInSchemaType } from './SignInSchema';

export const SignInForm = ({ locale }: { locale: Locale }) => {
    const {
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
            const response = await res.json();
            const status = res.status;
            if (status !== 200) {
                setToastMessage({ message: response.message, type: 'error' });
            } else {
                setToastMessage({ message: signedIn, type: 'success' });
                router.push(`/${locale}/dashboard`);
            }
        } catch (e) {
            setToastMessage({ message: getErrorMessage(e), type: 'error' });
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
