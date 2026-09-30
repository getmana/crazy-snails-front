'use client';

import Image from 'next/image';
import { useState } from 'react';

import { EditAlbumForm, Heading } from '@/components';
import { type SelectOption } from '@/components/common/FormElements/Select';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';
import { Album } from '@/types';
import { getPhotoUrl, resolveLocalizedValue } from '@/utils';

export const PublishedAlbumView = ({
    album,
    locale,
    countries,
    activities,
}: {
    album: Album;
    locale: Locale;
    countries: SelectOption[];
    activities: string[];
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const {
        editAlbumForm: { editBtn },
    } = useDictionary();

    if (isEditing) {
        return (
            <div className="w-full py-12 lg:w-2xl">
                <EditAlbumForm
                    album={album}
                    locale={locale}
                    countries={countries}
                    activities={activities}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    const { title, titleEn, titleUk, subtitle, subtitleEn, subtitleUk, photos } = album;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) ?? undefined;

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <Button type="button" onClick={() => setIsEditing(true)}>
                    {editBtn}
                </Button>
            </div>
            <Heading heading={localizedTitle} headingTag="h1" subheading={localizedSubtitle} className="heading-3" />
            {photos.length > 0 && (
                <div className="content grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {photos.map(({ photoId, photo }) => (
                        <div key={photoId} className="bg-accent relative aspect-square w-full overflow-hidden rounded-lg">
                            <Image
                                src={getPhotoUrl(photo.thumbnailSmKey || photo.originalKey)}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
