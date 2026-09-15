import { RichTextRenderer } from '@/components';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { resolveLocalizedValue, splitTiptapDocument } from '@/utils';

import { StoryCarousel } from './StoryCarousel';
import { StoryGallery } from './StoryGallery';
import { StoryHero } from './StoryHero';
import { StoryPair } from './StoryPair';

export const StoryContent = ({ story, locale }: { story: Story; locale: Locale }) => {
    const { description, descriptionEn, descriptionUk, heroFirst, photo, pairImageStories, galleryImageStories, carouselStories } = story;
    const localizedDescription = resolveLocalizedValue(descriptionEn, descriptionUk, description, locale);

    const heroBlock = photo ? <StoryHero photo={photo} /> : null;
    const pairBlock = pairImageStories.length === 2 ? <StoryPair items={pairImageStories} /> : null;
    const hasGallery = galleryImageStories.length === 3;
    const hasCarousel = carouselStories.length >= 2;

    const [descriptionPart1, descriptionPart2] = hasGallery ? splitTiptapDocument(localizedDescription) : [localizedDescription, null];

    return (
        <div className="content flex w-full flex-col">
            <div className="flex flex-col gap-2">
                {heroFirst ? (
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
            </div>
            <RichTextRenderer content={descriptionPart1} className="text-grey-nav mx-auto max-w-3xl py-6" />
            {hasGallery && <StoryGallery items={galleryImageStories} />}
            {hasGallery && <RichTextRenderer content={descriptionPart2} className="text-grey-nav mx-auto max-w-3xl py-6" />}
            {hasCarousel && <StoryCarousel items={carouselStories} locale={locale} />}
        </div>
    );
};
