import { getAdminStory } from '@/api/getAdminStory';
import { EditStoryForm, ToastMessage } from '@/components';
import { Locale } from '@/i18n-config';
import { SearchParams } from '@/types';

export default async function StoryEditPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const story = await getAdminStory(id);

    return (
        <div className="flex w-full flex-col">
            {toast ? <ToastMessage toast={toast} /> : null}
            <div className="w-full py-12 lg:w-2xl">
                <EditStoryForm story={story} locale={locale} />
            </div>
        </div>
    );
}
