import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { EditStoryForm, PublishedStoryView } from '@/components';
import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';
import { SearchParams, Story } from '@/types';

export default async function StoryAdminPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const response = await fetchWithAuth(`/stories/${id}`);
    if (response.status === 404) {
        notFound();
    }
    const story: Story = await response.json();
    console.log('story===>', story);

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            {story.isPublished ? (
                <PublishedStoryView story={story} locale={locale} />
            ) : (
                <div className="w-full py-12 lg:w-2xl">
                    <EditStoryForm story={story} locale={locale} />
                </div>
            )}
        </div>
    );
}
