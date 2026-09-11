import { notFound } from 'next/navigation';

import { Heading, StoryContent } from '@/components';
import { Locale } from '@/i18n-config';
import { SearchParams, Story } from '@/types';
import { getDictionary } from '@/utils';

export default async function StoryPublicPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { subtitle } = await getDictionary(locale);

    const response = await fetch(`${process.env.CS_API}/stories/${id}`);
    if (response.status === 404) {
        notFound();
    }
    const story: Story = await response.json();
    const title = (locale === 'en' ? story.titleEn || story.titleUk : story.titleUk || story.titleEn) || story.title;

    return (
        <div className="section">
            <Heading heading={title} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <StoryContent story={story} locale={locale} />
        </div>
    );
}
