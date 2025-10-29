import { HeaderAdmin } from '@/components';
import { AdminSidebar } from '@/components/common/AdminSidebar/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { type Locale } from '@/i18n-config';

export default async function AdminPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    return (
        <SidebarProvider>
            <AdminSidebar locale={locale} />
            <div className="w-full">
                <header className="border-b-border border-b py-1">
                    <SidebarTrigger />
                </header>
                <main>{props.children}</main>
            </div>
        </SidebarProvider>
    );
}
