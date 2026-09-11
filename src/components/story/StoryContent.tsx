import { RichTextRenderer } from '@/components';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { splitTiptapDocument } from '@/utils';

import { StoryCarousel } from './StoryCarousel';
import { StoryGallery } from './StoryGallery';
import { StoryHero } from './StoryHero';
import { StoryPair } from './StoryPair';

export const StoryContent = ({ story, locale }: { story: Story; locale: Locale }) => {
    const description = locale === 'en' ? story.descriptionEn || story.descriptionUk : story.descriptionUk || story.descriptionEn;

    const heroBlock = story.photo ? <StoryHero photo={story.photo} /> : null;
    const pairBlock = story.pairImageStories.length === 2 ? <StoryPair items={story.pairImageStories} /> : null;
    const hasGallery = story.galleryImageStories.length === 3;
    const hasCarousel = story.carouselStories.length >= 2;

    const [descriptionPart1, descriptionPart2] = hasGallery ? splitTiptapDocument(description) : [description, null];

    return (
        <div className="content flex w-full flex-col">
            <div className="flex flex-col gap-2">
                {story.heroFirst ? (
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
            {hasGallery && <StoryGallery items={story.galleryImageStories} />}
            {hasGallery && <RichTextRenderer content={descriptionPart2} className="text-grey-nav mx-auto max-w-3xl py-6" />}
            {hasCarousel && <StoryCarousel items={story.carouselStories} />}
        </div>
    );
};
