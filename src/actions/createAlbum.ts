'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export const createAlbum = async (formData: FormData) => {
    console.log('Sending request ==>', formData);

    try {
        const response = await fetch(`${process.env.CS_API}/albums`, {
            method: 'POST',
            body: formData,
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message }: ErrorResponse = responseData;
            return { message: `Unexpected Error Occured: ${message}`, data: null };
        }

        console.log('responseData', responseData, 'ok', response.ok);
        return { data: responseData, message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}`, data: null };
    }
};

export const createAlbumWithRedirect = async (formData: FormData) => {
    const { data, message } = await createAlbum(formData);
    if (message) {
        return message;
    }

    const { id } = data;

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums/${id}?toast=created`);
};
