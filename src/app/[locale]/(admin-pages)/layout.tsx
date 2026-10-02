import { AdminSidebar } from '@/components/layout/AdminSidebar/AdminSidebar';
import { AdminThemeProvider } from '@/components/layout/AdminThemeProvider';
import { AdminThemeToggle } from '@/components/layout/AdminThemeToggle';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
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
