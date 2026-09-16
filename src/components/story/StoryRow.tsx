import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { DeleteStoryDialog, Icon } from '@/components';
import { Button, buttonVariants } from '@/components/ui/button';
import { PLACEHOLDER_IMAGE_URL } from '@/constants/images';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { getPhotoUrl, resolveLocalizedValue } from '@/utils';

type OwnStory = Omit<Story, 'pairImageStories' | 'galleryImageStories' | 'carouselStories'>;

export const StoryRow = ({
    story,
    locale,
    editLabel,
    deleteLabel,
    publishedLabel,
    draftLabel,
}: {
    story: OwnStory;
    locale: Locale;
    editLabel: string;
    deleteLabel: string;
    publishedLabel: string;
    draftLabel: string;
}) => {
    const localizedTitle = resolveLocalizedValue(story.titleEn, story.titleUk, story.title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(story.subtitleEn, story.subtitleUk, story.subtitle, locale) ?? undefined;
    const editHref = `/dashboard/stories/${story.id}`;

    return (
        <div className="hover:bg-accent flex items-center gap-4 px-2 py-3 transition-colors">
            <Link href={editHref} className="flex min-w-0 flex-1 items-center gap-4">
                <Image
                    src={story.photo ? getPhotoUrl(story.photo.thumbnailSmKey || story.photo.originalKey) : PLACEHOLDER_IMAGE_URL}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-md object-cover"
                />

                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{localizedTitle}</p>
                    {localizedSubtitle && <p className="text-muted-foreground truncate text-sm">{localizedSubtitle}</p>}
                </div>
            </Link>

            <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm">
                <span
                    role="checkbox"
                    aria-checked={story.isPublished}
                    aria-readonly
                    data-state={story.isPublished ? 'checked' : 'unchecked'}
                    className="border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-[4px] border"
                >
                    {story.isPublished && <CheckIcon className="size-3.5" />}
                </span>
                <span className="w-28 whitespace-nowrap">{story.isPublished ? publishedLabel : draftLabel}</span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Link href={editHref} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    {editLabel}
                </Link>
                <DeleteStoryDialog
                    storyId={story.id}
                    trigger={
                        <Button type="button" variant="destructive" size="icon-sm" aria-label={deleteLabel}>
                            <Icon icon="TrashBin" className="size-4" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
};
