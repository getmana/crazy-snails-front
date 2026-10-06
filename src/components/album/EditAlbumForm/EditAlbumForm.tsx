'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type UpdateAlbumPayload, updateAlbumWithRedirect } from '@/actions/updateAlbum';
import { DeleteAlbumDialog } from '@/components/album/DeleteAlbumDialog';
import { RichTextEditor } from '@/components/fields/RichTextEditor';
import { Select } from '@/components/fields/Select';
import { TextInput } from '@/components/fields/TextInput';
import { ErrorText } from '@/components/shared/ErrorText';
import { Icon } from '@/components/shared/Icon/Icon';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDictionary, useToastMessageContext } from '@/context';
import { i18n, Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';
import { type SelectOption } from '@/types';
import { Album } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';
import {
    getLocaleFromCookie,
    getLocalizedActivityTypes,
    getLocalizedDescription,
    getLocalizedSubtitle,
    getLocalizedTitle,
    getPhotoUrl,
} from '@/utils';
import { isTiptapDocEmpty } from '@/utils/richText';

import { AlbumPhotoUpload } from './components/AlbumPhotoUpload';
import { EditAlbumSchema, EditAlbumSchemaType } from './EditAlbumSchema';

type EditAlbumFormProps = {
    album: Album;
    locale: Locale;
    countries: SelectOption[];
    activities: string[];
};

export const EditAlbumForm = ({ album, locale, countries, activities }: EditAlbumFormProps) => {
    const [isPending, startTransition] = useTransition();
    const { setToastMessage } = useToastMessageContext();

    const {
        editAlbumForm: {
            title,
            subtitleLabel,
            description,
            countriesLabel,
            countryPlaceholder,
            addCountryBtn,
            startDate: startDateLabel,
            endDate: endDateLabel,
            activityLabel,
            photosLabel,
            saveBtn,
            publishBtn,
            cancelBtn,
            deleteBtn,
        },
    } = useDictionary();

    const albumInitialPhotos = album.photos.map((item) => ({
        photoId: item.photoId,
        url: getPhotoUrl(item.photo.thumbnailSmKey || item.photo.originalKey),
    }));
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm<EditAlbumSchemaType>({
        resolver: zodResolver(EditAlbumSchema),
        defaultValues: {
            titleEn: album.titleEn || '',
            titleUk: album.titleUk || '',
            subtitleEn: album.subtitleEn || '',
            subtitleUk: album.subtitleUk || '',
            descriptionEn: album.descriptionEn ?? null,
            descriptionUk: album.descriptionUk ?? null,
            countries: album.countries.map((item) => ({ code: String(item.countryId) })),
            startDate: album.startDate.slice(0, 10),
            endDate: album.endDate.slice(0, 10),
            activityTypes: album.activities.map((item) => item.activityType),
            photos: {
                photoIds: album.photos.map((item) => item.photoId),
                previewImageId: album.previewImageId,
            },
        },
    });

    const { fields, append, remove } = useFieldArray<EditAlbumSchemaType>({
        control,
        name: 'countries',
    });

    const [titleEn, titleUk, photos] = watch(['titleEn', 'titleUk', 'photos']);
    const canPublish = !!(titleEn || titleUk) && photos.photoIds.length > 0;

    const buildPayload = (data: EditAlbumSchemaType, publish: boolean): UpdateAlbumPayload => {
        const preferredLocale = getLocaleFromCookie();
        const resolvedTitle = data[getLocalizedTitle(preferredLocale)] || [data.titleEn, data.titleUk].filter(Boolean)?.[0] || '';
        const resolvedSubtitle =
            data[getLocalizedSubtitle(preferredLocale)] || [data.subtitleEn, data.subtitleUk].filter(Boolean)?.[0] || '';

        const enDesc = !isTiptapDocEmpty(data.descriptionEn) ? data.descriptionEn : null;
        const ukDesc = !isTiptapDocEmpty(data.descriptionUk) ? data.descriptionUk : null;
        const resolvedDescription = ((preferredLocale === 'en' ? enDesc || ukDesc : ukDesc || enDesc) ?? undefined) as
            TiptapDocument | undefined;

        return {
            title: resolvedTitle,
            titleEn: data.titleEn,
            titleUk: data.titleUk,
            subtitle: resolvedSubtitle,
            subtitleEn: data.subtitleEn,
            subtitleUk: data.subtitleUk,
            description: resolvedDescription,
            descriptionEn: data.descriptionEn ?? undefined,
            descriptionUk: data.descriptionUk ?? undefined,
            countries: data.countries.filter(({ code }) => code).map(({ code }) => Number(code)),
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            activityTypes: data.activityTypes,
            albumPhotoIds: data.photos.photoIds,
            ...(data.photos.previewImageId !== null ? { previewImageId: data.photos.previewImageId } : {}),
            ...(publish ? { isPublished: true } : {}),
        };
    };

    const submit = (publish: boolean) =>
        handleSubmit((data) => {
            startTransition(async () => {
                const result = await updateAlbumWithRedirect(album.id, buildPayload(data, publish));
                if (result) {
                    setToastMessage({ message: result, type: 'error' });
                }
            });
        });

    const orderedLocales = [locale, ...i18n.locales.filter((l) => l !== locale)] as const;

    return (
        <div className="flex max-w-full flex-col pb-8">
            <form className="space-y-4">
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
                            <TextInput
                                label={subtitleLabel}
                                placeholder={`${l.toUpperCase()} ${subtitleLabel}`}
                                {...register(getLocalizedSubtitle(l))}
                                error={errors[getLocalizedSubtitle(l)]?.message}
                            />
                            <Controller
                                control={control}
                                name={getLocalizedDescription(l)}
                                render={({ field }) => (
                                    <RichTextEditor
                                        label={description}
                                        value={field.value as TiptapDocument | null}
                                        onChange={field.onChange}
                                        error={errors[getLocalizedDescription(l)]?.message}
                                    />
                                )}
                            />
                        </TabsContent>
                    ))}
                </Tabs>

                <div>
                    <label className="mb-1 block">{countriesLabel}</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-2 flex items-start space-x-2">
                            <Controller
                                control={control}
                                name={`countries.${index}.code`}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        error={errors.countries?.[index]?.code?.message}
                                        options={countries}
                                        placeholder={countryPlaceholder}
                                    />
                                )}
                            />
                            {fields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove country">
                                    <Icon icon="TrashBin" className="fill-foreground size-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {errors.countries?.root && <ErrorText text={errors.countries.root.message || 'Error when selecting country'} />}
                    {fields.length < 5 && (
                        <Button type="button" onClick={() => append({ code: '' })}>
                            {addCountryBtn}
                        </Button>
                    )}
                </div>

                <div>
                    <label className="mb-1 block">{activityLabel}</label>
                    <Controller
                        control={control}
                        name="activityTypes"
                        render={({ field: { value, onChange } }) => (
                            <ToggleGroup type="multiple" variant="outline" value={value} onValueChange={onChange}>
                                {activities.map((activity) => (
                                    <ToggleGroupItem key={activity} value={activity}>
                                        {getLocalizedActivityTypes({ activity, locale })}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        )}
                    />
                    {errors.activityTypes && <ErrorText text={errors.activityTypes.message || 'At least one activity type is required'} />}
                </div>

                <TextInput label={startDateLabel} type="date" {...register('startDate')} error={errors.startDate?.message} />
                <TextInput label={endDateLabel} type="date" {...register('endDate')} error={errors.endDate?.message} />

                <Controller
                    control={control}
                    name="photos"
                    render={({ field: { onChange } }) => (
                        <AlbumPhotoUpload
                            albumId={album.id}
                            label={photosLabel}
                            locale={locale}
                            countries={countries}
                            initialPhotos={albumInitialPhotos}
                            initialPreviewImageId={album.previewImageId}
                            onChange={onChange}
                        />
                    )}
                />

                <div className="flex gap-4">
                    <Link
                        href={`/${locale}/dashboard/albums/${album.id}`}
                        aria-disabled={isPending}
                        className={cn(buttonVariants({ variant: 'outline' }), isPending && 'pointer-events-none opacity-50')}
                    >
                        {cancelBtn}
                    </Link>
                    <Button type="button" disabled={isPending || !isDirty} onClick={submit(false)}>
                        {saveBtn}
                    </Button>
                    <Button type="button" disabled={isPending || !canPublish || (album.isPublished && !isDirty)} onClick={submit(true)}>
                        {publishBtn}
                    </Button>
                    <DeleteAlbumDialog
                        albumId={album.id}
                        trigger={
                            <Button type="button" variant="destructive" disabled={isPending}>
                                {deleteBtn}
                            </Button>
                        }
                    />
                </div>
            </form>
        </div>
    );
};
