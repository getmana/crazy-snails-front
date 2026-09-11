import Link from 'next/link';

import { fetchWithAuth } from '@/api/authFetch';
import { Locale } from '@/i18n-config';
import { OwnStoriesResponse } from '@/types';
import { getDictionary } from '@/utils';

export default async function AdminStoriesList(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    const response = await fetchWithAuth(`/stories/mine`);
    const storiesData: OwnStoriesResponse = await response.json();
    console.log('OWN STORIES ==>', storiesData);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.myStories}</h1>
            {storiesData.items.map(({ title, id }) => (
                <Link href={`/dashboard/stories/${id}`} key={id}>
                    <p>{title}</p>
                </Link>
            ))}
        </div>
    );
}
