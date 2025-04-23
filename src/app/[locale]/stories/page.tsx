import { getDictionary } from '@/utils';

import { Locale } from '../../../../i18n-config';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);

    return (
        <div>
            <h1 className="heading-2">{dictionary.title.stories}</h1>
        </div>
    );
}
