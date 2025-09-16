import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function CreateAlbum(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="section">
            <h1>{title.createAlbum}</h1>
        </div>
    );
}
