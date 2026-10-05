import Image from 'next/image';
import Link from 'next/link';

import { Heading } from '@/components/shared/Heading';
import { buttonVariants } from '@/components/ui/button';
import { Locale } from '@/i18n-config';
import { Album } from '@/types';
import { getDictionary, getPhotoUrl, resolveLocalizedValue } from '@/utils';

export const AlbumView = async ({ album, locale }: { album: Album; locale: Locale }) => {
    const {
        editAlbumForm: { editBtn },
    } = await getDictionary(locale);

    const { title, titleEn, titleUk, subtitle, subtitleEn, subtitleUk, photos } = album;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) ?? undefined;

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <Link href={`/${locale}/dashboard/albums/${album.id}/edit`} className={buttonVariants()}>
                    {editBtn}
                </Link>
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
