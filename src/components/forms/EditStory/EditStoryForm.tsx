'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type UpdateStoryPayload, updateStoryWithRedirect } from '@/actions/updateStory';
import {
    CarouselPhotoUpload,
    Checkbox,
    GalleryPhotoUpload,
    HeroPhotoUpload,
    PairPhotoUpload,
    RichTextEditor,
    TextInput,
} from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDictionary, useToastMessageContext } from '@/context';
import { i18n, Locale } from '@/i18n-config';
import { Story } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';
import { getLocaleFromCookie, getLocalizedDescription, getLocalizedTitle, getPhotoUrl } from '@/utils';
import { isTiptapDocEmpty } from '@/utils/richText';

import { EditStorySchema, EditStorySchemaType } from './EditStorySchema';

export const EditStoryForm = ({ story, locale, onCancel }: { story: Story; locale: Locale; onCancel?: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const { setToastMessage } = useToastMessageContext();

    const {
        editStoryForm: {
            title,
            description,
            heroFirstLabel,
            heroLabel,
            pairLabel,
            pairTip,
            galleryLabel,
            galleryTip,
            carouselLabel,
            saveBtn,
            publishBtn,
            cancelBtn,
        },
    } = useDictionary();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm<EditStorySchemaType>({
        resolver: zodResolver(EditStorySchema),
        defaultValues: {
            titleEn: story.titleEn || '',
            titleUk: story.titleUk || '',
            descriptionEn: story.descriptionEn ?? null,
            descriptionUk: story.descriptionUk ?? null,
            heroFirst: story.heroFirst,
            heroPhotoIds: story.photo ? story.photo.id : undefined,
            pairPhotoIds: story.pairImageStories.map((item) => item.photoId),
            galleryPhotoIds: story.galleryImageStories.map((item) => item.photoId),
            carouselPhotoIds: story.carouselStories.map((item) => item.photoId),
        },
    });

    const [titleEn, titleUk, descriptionEn, descriptionUk] = watch(['titleEn', 'titleUk', 'descriptionEn', 'descriptionUk']);
    const canPublish = !!(titleEn || titleUk) && (!isTiptapDocEmpty(descriptionEn) || !isTiptapDocEmpty(descriptionUk));

    const buildPayload = (data: EditStorySchemaType, publish: boolean): UpdateStoryPayload => {
        const preferredLocale = getLocaleFromCookie();
        const resolvedTitle = (preferredLocale === 'en' ? data.titleEn || data.titleUk : data.titleUk || data.titleEn) || '';
        const enDesc = !isTiptapDocEmpty(data.descriptionEn) ? data.descriptionEn : null;
        const ukDesc = !isTiptapDocEmpty(data.descriptionUk) ? data.descriptionUk : null;
        const resolvedDescription = ((preferredLocale === 'en' ? enDesc || ukDesc : ukDesc || enDesc) ?? undefined) as
            TiptapDocument | undefined;
        console.log('data to submit===>', data);
        return {
            title: resolvedTitle,
            titleEn: data.titleEn,
            titleUk: data.titleUk,
            description: resolvedDescription,
            descriptionEn: data.descriptionEn ?? undefined,
            descriptionUk: data.descriptionUk ?? undefined,
            heroFirst: data.heroFirst,
            heroImageId: data.heroPhotoIds ?? null,
            pairPhotoIds: data.pairPhotoIds,
            galleryPhotoIds: data.galleryPhotoIds,
            carouselPhotoIds: data.carouselPhotoIds,
            ...(publish ? { isPublished: true } : {}),
        };
    };

    const submit = (publish: boolean) =>
        handleSubmit((data) => {
            startTransition(async () => {
                const result = await updateStoryWithRedirect(story.id, buildPayload(data, publish));
                if (result) {
                    setToastMessage({ message: result, type: 'error' });
                }
            });
        });

    const orderedLocales = [locale, ...i18n.locales.filter((l) => l !== locale)] as const;

    const heroInitialPhotos = story.photo
        ? [{ photoId: story.photo.id, url: getPhotoUrl(story.photo.thumbnailSmKey || story.photo.originalKey) }]
        : [];
    const pairInitialPhotos = story.pairImageStories.map((item) => ({
        photoId: item.photoId,
        url: getPhotoUrl(item.photo.thumbnailSmKey || item.photo.originalKey),
    }));
    const galleryInitialPhotos = story.galleryImageStories.map((item) => ({
        photoId: item.photoId,
        url: getPhotoUrl(item.photo.thumbnailSmKey || item.photo.originalKey),
    }));
    const carouselInitialPhotos = story.carouselStories.map((item) => ({
        photoId: item.photoId,
        url: getPhotoUrl(item.photo.thumbnailSmKey || item.photo.originalKey),
    }));

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

                <Controller
                    control={control}
                    name="heroFirst"
                    render={({ field: { value, onChange } }) => (
                        <Checkbox label={heroFirstLabel} checked={value} onCheckedChange={(checked) => onChange(checked === true)} />
                    )}
                />

                <Controller
                    control={control}
                    name="heroPhotoIds"
                    render={({ field: { onChange } }) => (
                        <HeroPhotoUpload
                            label={heroLabel}
                            initialPhotos={heroInitialPhotos}
                            onChange={(photoIds) => onChange(photoIds[0])}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="pairPhotoIds"
                    render={({ field: { onChange } }) => (
                        <PairPhotoUpload label={pairLabel} tip={pairTip} initialPhotos={pairInitialPhotos} onChange={onChange} />
                    )}
                />

                <Controller
                    control={control}
                    name="galleryPhotoIds"
                    render={({ field: { onChange } }) => (
                        <GalleryPhotoUpload
                            label={galleryLabel}
                            tip={galleryTip}
                            initialPhotos={galleryInitialPhotos}
                            onChange={onChange}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="carouselPhotoIds"
                    render={({ field: { onChange } }) => (
                        <CarouselPhotoUpload label={carouselLabel} initialPhotos={carouselInitialPhotos} onChange={onChange} />
                    )}
                />

                <div className="flex gap-4">
                    {onCancel && (
                        <button type="button" className="btn-outline" disabled={isPending} onClick={onCancel}>
                            {cancelBtn}
                        </button>
                    )}
                    <button type="button" className="btn-primary" disabled={isPending || !isDirty} onClick={submit(false)}>
                        {saveBtn}
                    </button>
                    <button type="button" className="btn-primary" disabled={isPending || !canPublish || !isDirty} onClick={submit(true)}>
                        {publishBtn}
                    </button>
                </div>
            </form>
        </div>
    );
};
