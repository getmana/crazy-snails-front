import { getActivityTypes } from '@/api/getActivityTypes';
import { CreateAlbumForm } from '@/components';
import { Locale } from '@/i18n-config';
import { getCountriesByLocale, getDictionary } from '@/utils';

export default async function CreateAlbum(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    const countries = await getCountriesByLocale(locale);

    const activityTypes = await getActivityTypes();

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.createAlbum}</h1>
            <div className="w-full py-12 lg:w-2xl">
                <CreateAlbumForm countries={countries} locale={locale} activities={activityTypes} />
            </div>
        </div>
    );
}
