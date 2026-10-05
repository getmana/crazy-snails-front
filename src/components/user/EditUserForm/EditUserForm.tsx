'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateUser } from '@/actions/updateUser';
import { TextInput } from '@/components/fields/TextInput';
import { Button } from '@/components/ui/button';
import { useDictionary, useToastMessageContext } from '@/context';
import { Locale } from '@/i18n-config';
import { getErrorMessage } from '@/utils';

import { EditUserSchema, EditUserSchemaType } from './EditUserSchema';

type EditUserFormProps = { locale: Locale };

export const EditUserForm = ({ locale }: EditUserFormProps) => {
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
            const result = await updateUser(data);
            if (result.message) {
                setToastMessage({ message: result.message, type: 'error' });
            } else {
                const isEmailChanged = data.email;

                const message = isEmailChanged ? emailUpdated : usernameUpdated;
                setToastMessage({ message, type: 'success' });

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
                <Button type="submit" disabled={disableForm || !isValid}>
                    {button.editUser}
                </Button>
            </form>
        </div>
    );
};
