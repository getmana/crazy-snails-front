import Link from 'next/link';

import { Heading } from '@/components/shared/Heading';
import { StoryContent } from '@/components/story/StoryContent/StoryContent';
import { buttonVariants } from '@/components/ui/button';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { getDictionary, resolveLocalizedValue } from '@/utils';

export const StoryView = async ({ story, locale }: { story: Story; locale: Locale }) => {
    const {
        editStoryForm: { editBtn },
    } = await getDictionary(locale);

    const { titleEn, titleUk, title, subtitleEn, subtitleUk, subtitle } = story;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) ?? undefined;

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <Link href={`/${locale}/dashboard/stories/${story.id}/edit`} className={buttonVariants()}>
                    {editBtn}
                </Link>
            </div>
            <Heading heading={localizedTitle} headingTag="h1" subheading={localizedSubtitle} className="heading-3" />
            <StoryContent story={story} locale={locale} />
        </div>
    );
};
