import { Heading, PreviewCard } from '@/components';
import { Locale } from '@/i18n-config';
import { PublicStoriesResponse } from '@/types';
import { getDictionary, getPhotoUrl, getTiptapTextPreview } from '@/utils';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle, button } = await getDictionary(locale);

    const response = await fetch(`${process.env.CS_API}/users/${process.env.SITE_OWNER_ID}/stories`);
    const { items }: PublicStoriesResponse = await response.json();

    return (
        <div className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <div className="content grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((story) => {
                    const storyTitle = (locale === 'en' ? story.titleEn || story.titleUk : story.titleUk || story.titleEn) || story.title;
                    const description =
                        locale === 'en' ? story.descriptionEn || story.descriptionUk : story.descriptionUk || story.descriptionEn;
                    const photoKey = story.photo?.thumbnailMdKey ?? story.photo?.originalKey;

                    return (
                        <PreviewCard
                            key={story.id}
                            href={`/${locale}/stories/${story.id}`}
                            imageUrl={photoKey ? getPhotoUrl(photoKey) : null}
                            title={storyTitle}
                            excerpt={getTiptapTextPreview(description)}
                            readMoreLabel={button.readStory}
                        />
                    );
                })}
            </div>
        </div>
    );
}
