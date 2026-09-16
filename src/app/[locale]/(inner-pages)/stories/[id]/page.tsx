import { notFound } from 'next/navigation';

import { Heading, StoryContent } from '@/components';
import { Locale } from '@/i18n-config';
import { SearchParams, Story } from '@/types';
import { getDictionary, resolveLocalizedValue } from '@/utils';

export default async function StoryPublicPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const {
        subtitle: { stories: defaultSubtitle },
    } = await getDictionary(locale);

    const response = await fetch(`${process.env.CS_API}/stories/${id}`);
    if (response.status === 404) {
        notFound();
    }
    const story: Story = await response.json();

    const { titleEn, titleUk, title, subtitleEn, subtitleUk, subtitle } = story;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) || defaultSubtitle;

    return (
        <div className="section">
            <Heading heading={localizedTitle} className="heading-3" headingTag="h1" subheading={localizedSubtitle} />
            <StoryContent story={story} locale={locale} />
        </div>
    );
}
