import { getActivityTypes } from '@/api/getActivityTypes';
import { getAdminAlbum } from '@/api/getAdminAlbum';
import { EditAlbumForm, ToastMessage } from '@/components';
import { Locale } from '@/i18n-config';
import { SearchParams } from '@/types';
import { getCountriesByLocale } from '@/utils';

export default async function AlbumEditPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const album = await getAdminAlbum(id);
    const countries = await getCountriesByLocale(locale);
    const activities = await getActivityTypes();

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            <div className="w-full py-12 lg:w-2xl">
                <EditAlbumForm album={album} locale={locale} countries={countries} activities={activities} />
            </div>
        </div>
    );
}
