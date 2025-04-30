import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Albums(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle } = await getDictionary(locale);

    return (
        <main className="section">
            <Heading heading={title.albums} className="heading-3" headingTag="h1" subheading={subtitle.albums} />
        </main>
    );
}
