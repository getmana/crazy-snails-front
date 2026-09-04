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

    return (
        <div>
            <div className="flex justify-end px-8 pt-4">
                <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
                    {editBtn}
                </button>
            </div>
            <StoryContent story={story} locale={locale} />
        </div>
    );
};
