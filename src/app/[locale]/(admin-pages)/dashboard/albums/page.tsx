import Link from 'next/link';

import { fetchWithAuth } from '@/api/authFetch';
import { Locale } from '@/i18n-config';
import { OwnAlbumsResponse } from '@/types';
import { getDictionary } from '@/utils';

export default async function MyAlbums(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    const response = await fetchWithAuth(`/albums/mine`);
    const albumsData: OwnAlbumsResponse = await response.json();
    console.log('OWN ALBUMS ==>', albumsData);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.myAlbums}</h1>
            {albumsData.items.map(({ title, id }) => (
                <Link href={`/dashboard/albums/${id}`} key={id}>
                    <p>{title}</p>
                </Link>
            ))}
        </div>
    );
}
