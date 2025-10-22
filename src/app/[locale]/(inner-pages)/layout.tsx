import { Footer, Header } from '@/components';
import { type Locale } from '@/i18n-config';

export default async function InnerPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    return (
        <div className="flex min-h-dvh flex-col">
            <Header locale={locale} bgClassName="bg-white" />
            <main className="bg-page bg-center-top flex-1 flex-grow bg-cover">{props.children}</main>
            <Footer locale={locale} />
        </div>
    );
}
