'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ErrorText } from '@/components';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { getErrorMessage, internalAPIRoutes } from '@/utils';

import { SignUpSchema, SignUpSchemaType } from './SignUpSchema';

export const SignUpForm = () => {
    const { authForms, button } = useDictionary();

    const [isLoading, setIsLoading] = useState(false);
    // const [isRedirecting, setIsRedirecting] = useState(false);
    const { setToastMessage } = useToastMessageContext();
    const router = useRouter();

    const disableForm = isLoading;

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
    });

    const onSubmit = async (data: SignUpSchemaType) => {
        setIsLoading(true);
        reset();
        console.log('===================', JSON.stringify(data));
        try {
            const res = await fetch(internalAPIRoutes.signup, { body: JSON.stringify(data), method: 'POST' });
            const response = await res.json();
            const status = res.status;
            if (status !== 200) {
                setToastMessage({ message: response.message, type: 'error' });
            } else {
                setToastMessage({ message: 'Success! Please, sign in to your newly created account. Redirecting...', type: 'success' });
                router.push('/signin');
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
                <div className="input-wrapper">
                    <label>{authForms.username}</label>
                    <input {...register('username')} autoComplete="user-name" disabled={disableForm} />
                    {errors.username?.message && <ErrorText text={errors.username.message} />}
                </div>
                <div className="input-wrapper">
                    <label>{authForms.email}</label>
                    <input {...register('email')} autoComplete="email" type="email" disabled={disableForm} />
                    {errors.email?.message && <ErrorText text={errors.email.message} />}
                </div>
                <div className="input-wrapper">
                    <label>{authForms.password}</label>
                    <input {...register('password')} type="password" autoComplete="password" disabled={disableForm} />
                    {errors.password?.message && <ErrorText text={errors.password.message} />}
                </div>
                <button className="btn-primary" type="submit" disabled={disableForm}>
                    {button.createAccount}
                </button>
            </form>
        </div>
    );
};
