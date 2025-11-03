import { CreateAlbumForm } from '@/components';
import { Locale } from '@/i18n-config';
import { getCountries } from '@/lib';
import { getDictionary } from '@/utils';

export default async function CreateAlbum(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    const countryList = getCountries(locale);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3">{title.createAlbum}</h1>
            <div className="w-full py-12 lg:w-2xl">
                <CreateAlbumForm countries={countryList} locale={locale} />
            </div>
        </div>
    );
}
