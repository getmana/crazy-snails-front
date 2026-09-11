import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Stories(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle } = await getDictionary(locale);

    const response = await fetch(`${process.env.CS_API}/users/${process.env.SITE_OWNER_ID}/stories`);
    const storiesData: any = await response.json();
    console.log('stories published', storiesData);

    return (
        <div className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
        </div>
    );
}
