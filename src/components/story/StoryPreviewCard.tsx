import { PreviewCard } from '@/components/shared/PreviewCard';
import { Locale } from '@/i18n-config';
import { StoryPreview } from '@/types';
import { getPhotoUrl, getTiptapTextPreview, resolveLocalizedValue } from '@/utils';

type StoryPreviewCardProps = { story: StoryPreview; locale: Locale; readMoreLabel: string };

export const StoryPreviewCard = ({ story, locale, readMoreLabel }: StoryPreviewCardProps) => {
    const { titleEn, titleUk, title, descriptionEn, descriptionUk, description, id, photo } = story;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedDescription = resolveLocalizedValue(descriptionEn, descriptionUk, description, locale);
    const photoKey = photo?.thumbnailMdKey ?? photo?.originalKey;

    return (
        <PreviewCard
            href={`/${locale}/stories/${id}`}
            imageUrl={photoKey ? getPhotoUrl(photoKey) : null}
            title={localizedTitle}
            excerpt={getTiptapTextPreview(localizedDescription)}
            readMoreLabel={readMoreLabel}
        />
    );
};
