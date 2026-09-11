'use client';

import { useState } from 'react';

import { EditStoryForm } from '@/components';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';
import { Story } from '@/types';

import { StoryContent } from './StoryContent';

export const PublishedStoryView = ({ story, locale }: { story: Story; locale: Locale }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {
        editStoryForm: { editBtn },
    } = useDictionary();

    if (isEditing) {
        return <EditStoryForm story={story} locale={locale} onCancel={() => setIsEditing(false)} />;
    }

    const title = (locale === 'en' ? story.titleEn || story.titleUk : story.titleUk || story.titleEn) || story.title;

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
                    {editBtn}
                </button>
            </div>
            <h1 className="heading-3 py-8">{title}</h1>
            <StoryContent story={story} locale={locale} />
        </div>
    );
};
