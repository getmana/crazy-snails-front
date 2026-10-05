'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateAlbumPhotoNote } from '@/actions/updateAlbumPhotoNote';
import { RichTextEditor } from '@/components/fields/RichTextEditor';
import { Select } from '@/components/fields/Select';
import { type SelectOption } from '@/components/fields/Select';
import { TextInput } from '@/components/fields/TextInput';
import { EMPTY_DOC } from '@/components/fields/tiptapDocumentSchema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDictionary, useToastMessageContext } from '@/context';
import { i18n, Locale } from '@/i18n-config';
import type { AlbumNoteValues } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';
import { getLocaleFromCookie, getLocalizedDescription, getLocalizedTitle } from '@/utils';
import { isTiptapDocEmpty } from '@/utils/richText';

import { EditNoteSchema, EditNoteSchemaType } from './EditNoteSchema';

type EditNoteFormProps = {
    albumId: number;
    photoId: number;
    locale: Locale;
    countries: SelectOption[];
    initialNote?: AlbumNoteValues;
    onCancel: () => void;
    onSaved: () => void;
};

export const EditNoteForm = ({ albumId, photoId, locale, countries, initialNote, onCancel, onSaved }: EditNoteFormProps) => {
    const [isPending, startTransition] = useTransition();
    const { setToastMessage } = useToastMessageContext();

    const { control, register, handleSubmit } = useForm<EditNoteSchemaType>({
        resolver: zodResolver(EditNoteSchema),
        defaultValues: {
            titleEn: initialNote?.titleEn ?? '',
            titleUk: initialNote?.titleUk ?? '',
            descriptionEn: initialNote?.descriptionEn ?? null,
            descriptionUk: initialNote?.descriptionUk ?? null,
            country: initialNote?.countryId ? String(initialNote.countryId) : '',
            date: initialNote?.date ? initialNote.date.slice(0, 10) : '',
        },
    });

    const {
        editAlbumForm: { countryPlaceholder },
        editNoteForm: { noteTitleLabel, noteDescriptionLabel, noteCountryLabel, noteDateLabel, noteSaveBtn, noteCancelBtn },
    } = useDictionary();

    const onSubmit = (data: EditNoteSchemaType) => {
        const preferredLocale = getLocaleFromCookie();
        const enDesc = !isTiptapDocEmpty(data.descriptionEn) ? data.descriptionEn : null;
        const ukDesc = !isTiptapDocEmpty(data.descriptionUk) ? data.descriptionUk : null;
        const resolvedDescription = (preferredLocale === 'en' ? enDesc || ukDesc : ukDesc || enDesc) ?? EMPTY_DOC;

        startTransition(async () => {
            const result = await updateAlbumPhotoNote(albumId, photoId, {
                titleEn: data.titleEn || null,
                titleUk: data.titleUk || null,
                description: resolvedDescription,
                descriptionEn: enDesc,
                descriptionUk: ukDesc,
                country: data.country ? Number(data.country) : null,
                date: data.date ? new Date(data.date).toISOString() : null,
            });

            if (result.message) {
                setToastMessage({ message: result.message, type: 'error' });
                return;
            }

            onSaved();
        });
    };

    const orderedLocales = [locale, ...i18n.locales.filter((l) => l !== locale)] as const;

    return (
        <div className="space-y-4">
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
                            label={noteTitleLabel}
                            placeholder={`${l.toUpperCase()} ${noteTitleLabel}`}
                            {...register(getLocalizedTitle(l))}
                        />
                        <Controller
                            control={control}
                            name={getLocalizedDescription(l)}
                            render={({ field }) => (
                                <RichTextEditor
                                    label={noteDescriptionLabel}
                                    value={field.value as TiptapDocument | null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </TabsContent>
                ))}
            </Tabs>
            <Controller
                control={control}
                name="country"
                render={({ field: { value, onChange } }) => (
                    <Select
                        label={noteCountryLabel}
                        value={value}
                        onChange={onChange}
                        options={countries}
                        placeholder={countryPlaceholder}
                    />
                )}
            />
            <TextInput label={noteDateLabel} type="date" {...register('date')} />
            <div className="flex gap-4">
                <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
                    {noteCancelBtn}
                </Button>
                <Button type="button" disabled={isPending} onClick={handleSubmit(onSubmit)}>
                    {noteSaveBtn}
                </Button>
            </div>
        </div>
    );
};
