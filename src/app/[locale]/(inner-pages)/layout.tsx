import { Header } from '@/components';
import { i18n, type Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function InnerPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);
    return (
        <div className="bg-page bg-center-top flex-grow bg-cover">
            <Header items={dictionary.menu} locale={locale} bgClassName="bg-white" />
            <main className="">{props.children}</main>
        </div>
    );
}
