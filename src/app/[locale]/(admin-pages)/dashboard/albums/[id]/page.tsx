import { fetchWithAuth } from '@/api/authFetch';
import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';
import { SearchParams } from '@/types';

export default async function AlbumAdminPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const response = await fetchWithAuth(`/albums/${id}`);
    const albumData = await response.json();
    console.log('albumdata===>', albumData);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{`album id = ${id}`}</h1>
            {toast ? <ToastMessage toast={toast} /> : null}
        </div>
    );
}
