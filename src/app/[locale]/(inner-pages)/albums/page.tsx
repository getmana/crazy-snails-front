import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Albums(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle } = await getDictionary(locale);

    const response = await fetch(`${process.env.CS_API}/users/${process.env.SITE_OWNER_ID}/albums`);
    const albumsData: any = await response.json();
    console.log('albums published', albumsData);

    return (
        <div className="section">
            <Heading heading={title.albums} className="heading-3" headingTag="h1" subheading={subtitle.albums} />
        </div>
    );
}
