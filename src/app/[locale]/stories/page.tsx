import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);

    return (
        <div>
            <h1 className="heading-3">{dictionary.title.stories}</h1>
        </div>
    );
}
