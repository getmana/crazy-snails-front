import { Footer, Header } from '@/components';
import { type Locale } from '@/i18n-config';

export default async function InnerPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }>,
) {
    const { locale } = (await props.params) as { locale: Locale };

    return (
        <div className="flex min-h-dvh flex-col">
            <Header locale={locale} bgClassName="bg-white" />
            <main className="relative flex-1 flex-grow overflow-hidden">
                {/* blur-lg */}
                <div className="bg-page bg-center-top absolute -inset-8 -z-10 bg-cover bg-fixed" />
                {props.children}
            </main>
            <Footer locale={locale} />
        </div>
    );
}
