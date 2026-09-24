import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { PublishedAlbumView } from '@/components';
import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';
import { Album, SearchParams } from '@/types';

export default async function AlbumAdminPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const response = await fetchWithAuth(`/albums/${id}`);
    if (response.status === 404) {
        notFound();
    }
    const album: Album = await response.json();

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            {album.isPublished ? (
                <PublishedAlbumView album={album} locale={locale} />
            ) : (
                <h1 className="heading-3 py-8">{`album id = ${id}`}</h1>
            )}
        </div>
    );
}
