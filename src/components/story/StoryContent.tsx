import Image from 'next/image';

import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { getPhotoUrl } from '@/utils';

export const StoryContent = ({ story, locale }: { story: Story; locale: Locale }) => {
    const title = (locale === 'en' ? story.title_en || story.title_uk : story.title_uk || story.title_en) || story.title;
    const description = locale === 'en' ? story.description_en || story.description_uk : story.description_uk || story.description_en;

    const heroBlock = story.photo ? (
        <div className="relative aspect-[2/1] w-full">
            <Image src={getPhotoUrl(story.photo.original_key)} alt="" fill className="object-cover" sizes="100vw" />
        </div>
    ) : null;

    const pairSorted = story.pair_image_stories.slice().sort((a, b) => a.position - b.position);
    const pairBlock =
        pairSorted.length === 2 ? (
            <div className="flex w-full">
                {pairSorted.map((item) => (
                    <div key={item.photo_id} className="relative aspect-square w-1/2">
                        <Image src={getPhotoUrl(item.photo.original_key)} alt="" fill className="object-cover" sizes="50vw" />
                    </div>
                ))}
            </div>
        ) : null;

    const gallerySorted = story.gallery_image_stories.slice().sort((a, b) => a.position - b.position);
    const galleryBlock =
        gallerySorted.length === 3 ? (
            <div className="flex w-full gap-2">
                <div className="relative aspect-square w-1/2">
                    <Image src={getPhotoUrl(gallerySorted[0].photo.original_key)} alt="" fill className="object-cover" sizes="50vw" />
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                    {gallerySorted.slice(1).map((item) => (
                        <div key={item.photo_id} className="relative aspect-[2/1] w-full">
                            <Image src={getPhotoUrl(item.photo.original_key)} alt="" fill className="object-cover" sizes="50vw" />
                        </div>
                    ))}
                </div>
            </div>
        ) : null;

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title}</h1>
            {story.hero_first ? (
                <>
                    {heroBlock}
                    {pairBlock}
                </>
            ) : (
                <>
                    {pairBlock}
                    {heroBlock}
                </>
            )}
            {description && <p className="py-6">{description}</p>}
            {galleryBlock}
        </div>
    );
};
