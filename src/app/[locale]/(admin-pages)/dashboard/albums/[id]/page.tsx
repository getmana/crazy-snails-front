import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { getActivityTypes } from '@/api/getActivityTypes';
import { EditAlbumForm, PublishedAlbumView } from '@/components';
import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';
import { Album, SearchParams } from '@/types';
import { getCountriesByLocale } from '@/utils';

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

    const countries = await getCountriesByLocale(locale);
    const activities = await getActivityTypes();

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            {album.isPublished ? (
                <PublishedAlbumView album={album} locale={locale} countries={countries} activities={activities} />
            ) : (
                <div className="w-full py-12 lg:w-2xl">
                    <EditAlbumForm album={album} locale={locale} countries={countries} activities={activities} />
                </div>
            )}
        </div>
    );
}
