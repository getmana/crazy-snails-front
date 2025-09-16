import { HeaderAdmin } from '@/components';
import { type Locale } from '@/i18n-config';

export default async function AdminPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    return (
        <div className="bg-page bg-center-top flex-grow bg-cover">
            <HeaderAdmin locale={locale} />
            <main>{props.children}</main>
        </div>
    );
}
