import { Header, Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Grandpa(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);

    return (
        <div className="bg-grandpa bg-center-top flex-grow bg-cover">
            <Header
                items={dictionary.menu}
                locale={locale}
                bgClassName="bg-brown-light"
                textClassName="text-custom-blue font-caveat"
                hasDivider={true}
            />
            <main className="">
                <Heading
                    heading={dictionary.title.grandpa}
                    className="font-caveat text-custom-blue text-heading-2-custom"
                    headingTag="h1"
                    subheading={dictionary.subtitle.grandpa}
                    subheadingClassName="font-caveat text-foreground-custom text-4xl"
                />
            </main>
        </div>
    );
}
