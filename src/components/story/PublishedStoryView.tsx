'use client';

import { useState } from 'react';

import { EditStoryForm, Heading } from '@/components';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';
import { resolveLocalizedValue } from '@/utils';

import { StoryContent } from './StoryContent';

export const PublishedStoryView = ({ story, locale }: { story: Story; locale: Locale }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {
        editStoryForm: { editBtn },
    } = useDictionary();

    if (isEditing) {
        return <EditStoryForm story={story} locale={locale} onCancel={() => setIsEditing(false)} />;
    }

    const { titleEn, titleUk, title, subtitleEn, subtitleUk, subtitle } = story;
    const localizedTitle = resolveLocalizedValue(titleEn, titleUk, title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(subtitleEn, subtitleUk, subtitle, locale) ?? undefined;

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <Button type="button" onClick={() => setIsEditing(true)}>
                    {editBtn}
                </Button>
            </div>
            <Heading heading={localizedTitle} headingTag="h1" subheading={localizedSubtitle} className="heading-3" />
            <StoryContent story={story} locale={locale} />
        </div>
    );
};
