import Link from 'next/link';

import { Heading, StoryPreviewCard } from '@/components';
import { Locale } from '@/i18n-config';
import { StoryPreview } from '@/types';
import { DictionaryType } from '@/utils';

export const StoriesSection = async ({
    dictionary,
    locale,
    previewItems,
}: {
    dictionary: DictionaryType;
    locale: Locale;
    previewItems: StoryPreview[];
}) => {
    const { subtitle, title, button } = dictionary;

    return (
        <section className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <div className="content">
                {previewItems.length > 0 && (
                    <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {previewItems.map((story) => (
                            <StoryPreviewCard key={story.id} story={story} locale={locale} readMoreLabel={button.readStory} />
                        ))}
                    </div>
                )}
                <div className="flex justify-center">
                    <Link href={`/${locale}/stories`} className="btn-primary block">
                        {button.readAll}
                    </Link>
                </div>
            </div>
        </section>
    );
};
