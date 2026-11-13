'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { readErrorResponse } from '@/api/readErrorResponse';
import { PasswordInput } from '@/components/fields/PasswordInput';
import { TextInput } from '@/components/fields/TextInput';
import { API_ERROR_CODES } from '@/constants';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { getApiErrorMessage, internalAPIRoutes } from '@/utils';

import { SignUpSchema, SignUpSchemaType } from './SignUpSchema';

type SignUpFormProps = { locale: Locale };

export const SignUpForm = ({ locale }: SignUpFormProps) => {
    const {
        apiErrors,
        authForms,
        button,
        systemMessages: { signedUp },
    } = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setToastMessage } = useToastMessageContext();

    const router = useRouter();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
    });

    const disableForm = isLoading;

    const onSubmit = async (data: SignUpSchemaType) => {
        setIsLoading(true);
        reset();
        try {
            const res = await fetch(internalAPIRoutes.signup, { body: JSON.stringify(data), method: 'POST' });
            if (!res.ok) {
                const error = await readErrorResponse(res);
                setToastMessage({ message: getApiErrorMessage(error, apiErrors), type: 'error' });
            } else {
                const response = await res.json();
                setToastMessage({ message: signedUp, type: 'success' });
                console.log('sign up response data ==>', response.data);
                router.push(`/${locale}/signin`);
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
                <TextInput label={authForms.username} disabled={disableForm} error={errors.username?.message} {...register('username')} />
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
                    autoComplete="new-password"
                />
                <button className="btn-primary" type="submit" disabled={disableForm}>
                    {button.createAccount}
                </button>
            </form>
        </div>
    );
};
