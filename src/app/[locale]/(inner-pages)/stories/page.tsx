import { getPublicStories } from '@/api/getPublicStories';
import { Heading, PreviewCard } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary, getPhotoUrl, getTiptapTextPreview, resolveLocalizedValue } from '@/utils';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle, button } = await getDictionary(locale);

    const { items } = await getPublicStories();

    return (
        <div className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <div className="content grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((story) => {
                    const { titleEn, titleUk, title, descriptionEn, descriptionUk, description, id, photo } = story;
                    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
                    const localizedDescription = resolveLocalizedValue(descriptionEn, descriptionUk, description, locale);
                    const photoKey = photo?.thumbnailMdKey ?? photo?.originalKey;

                    return (
                        <PreviewCard
                            key={id}
                            href={`/${locale}/stories/${id}`}
                            imageUrl={photoKey ? getPhotoUrl(photoKey) : null}
                            title={localizedTitle}
                            excerpt={getTiptapTextPreview(localizedDescription)}
                            readMoreLabel={button.readStory}
                        />
                    );
                })}
            </div>
        </div>
    );
}
