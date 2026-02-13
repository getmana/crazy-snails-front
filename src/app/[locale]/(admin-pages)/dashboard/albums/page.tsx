import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function MyAlbums(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.myAlbums}</h1>
        </div>
    );
}
