import { AdminSidebar } from '@/components/common/AdminSidebar/AdminSidebar';
import { AdminThemeProvider } from '@/components/common/AdminThemeProvider';
import { AdminThemeToggle } from '@/components/common/AdminThemeToggle';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { type Locale } from '@/i18n-config';

export default async function AdminPagesLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }>,
) {
    const { locale } = (await props.params) as { locale: Locale };

    return (
        <AdminThemeProvider>
            <SidebarProvider>
                <AdminSidebar locale={locale} />
                <div className="w-full">
                    <header className="border-b-border flex items-center justify-between border-b py-1">
                        <SidebarTrigger />
                        <div className="flex items-center gap-2">
                            <LocaleSwitcher locale={locale} />
                            <AdminThemeToggle />
                        </div>
                    </header>
                    <main>{props.children}</main>
                </div>
            </SidebarProvider>
        </AdminThemeProvider>
    );
}
