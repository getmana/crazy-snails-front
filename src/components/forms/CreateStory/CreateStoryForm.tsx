'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type CreateStoryPayload, createStoryWithRedirect } from '@/actions/createStory';
import { TextInput } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDictionary, useToastMessageContext } from '@/context';
import { i18n, Locale } from '@/i18n-config';
import { getLocaleFromCookie, getLocalizedTitle } from '@/utils';

import { CreateStorySchema, CreateStorySchemaType } from './CreateStorySchema';

export const CreateStoryForm = ({ locale }: { locale: Locale }) => {
    const [isPending, startTransition] = useTransition();

    const { setToastMessage } = useToastMessageContext();

    const {
        createStoryForm: { title, submitBtn },
    } = useDictionary();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateStorySchemaType>({
        resolver: zodResolver(CreateStorySchema),
        defaultValues: {
            titleEn: '',
            titleUk: '',
        },
    });

    const onSubmit = async (data: CreateStorySchemaType) => {
        const preferredLocale = getLocaleFromCookie();
        const title = (preferredLocale === 'en' ? data.titleEn || data.titleUk : data.titleUk || data.titleEn) || '';

        const payload: CreateStoryPayload = {
            title,
            titleEn: data.titleEn,
            titleUk: data.titleUk,
        };

        startTransition(async () => {
            const result = await createStoryWithRedirect(payload);
            if (result) {
                setToastMessage({ message: result, type: 'error' });
            }
        });
    };

    const orderedLocales = [locale, ...i18n.locales.filter((l) => l !== locale)] as const;

    return (
        <div className="flex max-w-full flex-col pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue={locale}>
                    <TabsList>
                        {orderedLocales.map((l) => (
                            <TabsTrigger key={l} value={l}>
                                {l.toUpperCase()}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {orderedLocales.map((l) => (
                        <TabsContent key={l} value={l}>
                            <TextInput
                                label={title}
                                placeholder={`${l.toUpperCase()} ${title}`}
                                {...register(getLocalizedTitle(l))}
                                error={errors[getLocalizedTitle(l)]?.message}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
                <button type="submit" className="btn-primary" disabled={isPending}>
                    {submitBtn}
                </button>
            </form>
        </div>
    );
};
