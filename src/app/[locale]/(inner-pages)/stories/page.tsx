import { getPublicStories } from '@/api/getPublicStories';
import { Heading, StoryPreviewCard } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle, button } = await getDictionary(locale);

    const { items } = await getPublicStories();

    return (
        <div className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <div className="content grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((story) => (
                    <StoryPreviewCard key={story.id} story={story} locale={locale} readMoreLabel={button.readStory} />
                ))}
            </div>
        </div>
    );
}
