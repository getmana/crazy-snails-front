import Link from 'next/link';

import { fetchWithAuth } from '@/api/authFetch';
import { ToastMessage } from '@/components';
import { Locale } from '@/i18n-config';
import { OwnAlbumsResponse, SearchParams } from '@/types';
import { getDictionary } from '@/utils';

export default async function MyAlbums(props: { params: Promise<{ locale: Locale }>; searchParams: Promise<SearchParams> }) {
    const { locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const { title } = await getDictionary(locale);

    const response = await fetchWithAuth(`/albums/mine`);
    const albumsData: OwnAlbumsResponse = await response.json();

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.myAlbums}</h1>
            {albumsData.items.map(({ title, id }) => (
                <Link href={`/dashboard/albums/${id}`} key={id}>
                    <p>{title}</p>
                </Link>
            ))}
            {toast ? <ToastMessage toast={toast} /> : null}
        </div>
    );
}
