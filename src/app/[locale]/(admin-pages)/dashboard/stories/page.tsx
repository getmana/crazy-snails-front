import { fetchWithAuth } from '@/api/authFetch';
import { StoryRow } from '@/components';
import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';
import { OwnStoriesResponse, SearchParams } from '@/types';
import { getDictionary } from '@/utils';

export default async function AdminStoriesList(props: { params: Promise<{ locale: Locale }>; searchParams: Promise<SearchParams> }) {
    const { locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const {
        title,
        editStoryForm: { editBtn, deleteBtn },
        adminStoriesList: { publishedLabel, draftLabel, emptyMessage },
    } = await getDictionary(locale);

    const response = await fetchWithAuth(`/stories/mine`);
    const storiesData: OwnStoriesResponse = await response.json();

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            <h1 className="heading-3 py-8">{title.myStories}</h1>
            {storiesData.items.length === 0 ? (
                <p className="text-muted-foreground">{emptyMessage}</p>
            ) : (
                <div className="divide-border divide-y border-y">
                    {storiesData.items.map((story) => (
                        <StoryRow
                            key={story.id}
                            story={story}
                            locale={locale}
                            editLabel={editBtn}
                            deleteLabel={deleteBtn}
                            publishedLabel={publishedLabel}
                            draftLabel={draftLabel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
