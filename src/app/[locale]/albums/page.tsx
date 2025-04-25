import { Header, Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Albums(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);

    return (
        <div className="bg-page bg-center-top flex-grow bg-cover">
            <Header items={dictionary.menu} locale={locale} bgClassName="bg-white" activeLink={`/${locale}/albums`} />
            <main className="">
                <Heading heading={dictionary.title.albums} className="heading-3" headingTag="h1" subheading={dictionary.subtitles.albums} />
            </main>
        </div>
    );
}
