'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextInput } from '@/components';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { getErrorMessage, internalAPIRoutes } from '@/utils';

import { EditUserSchema, EditUserSchemaType } from './EditUserSchema';

export const EditUserForm = ({ locale }: { locale: Locale }) => {
    const {
        editUserForm,
        button,
        systemMessages: { emailUpdated, usernameUpdated },
    } = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { setToastMessage } = useToastMessageContext();
    const router = useRouter();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(EditUserSchema),
    });

    const disableForm = isLoading;

    const onSubmit = async (data: EditUserSchemaType) => {
        setIsLoading(true);
        reset();
        try {
            const res = await fetch(internalAPIRoutes.editUser, { body: JSON.stringify(data), method: 'PATCH' });
            const response = await res.json();
            const status = res.status;
            if (status !== 200) {
                setToastMessage({ message: response.message, type: 'error' });
                if (status === 401) {
                    router.push(`/${locale}/signin`);
                }
            } else {
                const isEmailChanged = data.email;

                const message = isEmailChanged ? emailUpdated : usernameUpdated;
                setToastMessage({ message, type: 'success' });
                console.log('sign up response data ==>', response.data);

                const path = isEmailChanged ? 'signin' : 'dashboard';
                router.push(`/${locale}/${path}`);
            }
        } catch (e) {
            setToastMessage({ message: getErrorMessage(e), type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex max-w-full flex-col pb-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    label={editUserForm.username}
                    disabled={disableForm}
                    error={errors.username?.message}
                    {...register('username')}
                />
                <TextInput
                    type="email"
                    label={editUserForm.email}
                    disabled={disableForm}
                    error={errors.email?.message}
                    {...register('email')}
                    autoComplete="email"
                />
                <button className="btn-primary" type="submit" disabled={disableForm || !isValid}>
                    {button.editUser}
                </button>
            </form>
        </div>
    );
};
