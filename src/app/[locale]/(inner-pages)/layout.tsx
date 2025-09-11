import { Header } from '@/components';
import { type Locale } from '@/i18n-config';

export default async function InnerPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    return (
        <div className="bg-page bg-center-top flex-grow bg-cover">
            <Header locale={locale} bgClassName="bg-white" />
            <main>{props.children}</main>
        </div>
    );
}
