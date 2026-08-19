import { Footer, Header, Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Grandpa(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle } = await getDictionary(locale);

    return (
        <div className="flex min-h-dvh flex-col">
            <Header
                hideLocaleSwitcher={true}
                locale={locale}
                bgClassName="bg-brown-light"
                textClassName="text-custom-blue font-caveat"
                hasDivider={true}
            />
            <main className="bg-grandpa bg-center-top flex-1 flex-grow bg-cover">
                <Heading
                    heading={title.grandpa}
                    className="font-caveat text-custom-blue text-heading-2-custom"
                    headingTag="h1"
                    subheading={subtitle.grandpa}
                    subheadingClassName="font-caveat text-foreground-custom text-4xl"
                />
            </main>
            <Footer locale={locale} />
        </div>
    );
}
