import { deleteStoryWithRedirect } from '@/actions/deleteStory';
import { fetchWithAuth } from '@/api/authFetch';
import { AdminListRow, ToastMessage } from '@/components';
import { Locale } from '@/i18n-config';
import { OwnStoriesResponse, SearchParams } from '@/types';
import { getDictionary } from '@/utils';

export default async function AdminStoriesList(props: { params: Promise<{ locale: Locale }>; searchParams: Promise<SearchParams> }) {
    const { locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const {
        title,
        editStoryForm: { editBtn, deleteBtn, confirmDelete, cancelBtn },
        adminStoriesList: { publishedLabel, draftLabel, emptyMessage },
    } = await getDictionary(locale);
    const labels = {
        edit: editBtn,
        delete: deleteBtn,
        published: publishedLabel,
        draft: draftLabel,
        confirmDelete,
        cancel: cancelBtn,
    };

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
                        <AdminListRow
                            key={story.id}
                            item={story}
                            locale={locale}
                            viewHref={`/${locale}/dashboard/stories/${story.id}`}
                            editHref={`/${locale}/dashboard/stories/${story.id}/edit`}
                            deleteAction={deleteStoryWithRedirect.bind(null, story.id)}
                            labels={labels}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
