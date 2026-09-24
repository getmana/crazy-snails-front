import Image from 'next/image';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { Album } from '@/types';
import { getPhotoUrl, resolveLocalizedValue } from '@/utils';

export const PublishedAlbumView = ({ album, locale }: { album: Album; locale: Locale }) => {
    const { title, titleEn, titleUk, subtitle, subtitleEn, subtitleUk, albumPhotos } = album;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) ?? undefined;

    return (
        <div>
            <Heading heading={localizedTitle} headingTag="h1" subheading={localizedSubtitle} className="heading-3" />
            {albumPhotos.length > 0 && (
                <div className="content grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {albumPhotos.map(({ photoId, photo }) => (
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
