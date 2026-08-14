import type { Metadata } from 'next';
import { Caveat, Pacifico, Raleway } from 'next/font/google';

import { Footer } from '@/components';
import { ToastMessageWrapper } from '@/components/common/ToastMessageWrapper';
import { ActivityTypesProvider, DictionaryProvider, ToastMessageProvider } from '@/context';
import { i18n, type Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

import '@/styles/globals.css';

const raleway = Raleway({
    variable: '--font-raleway',
    weight: ['400', '600', '700', '800'],
    subsets: ['latin', 'cyrillic'],
});

const pacifico = Pacifico({
    variable: '--font-pacifico',
    weight: ['400'],
    subsets: ['latin', 'cyrillic'],
});

const caveat = Caveat({
    variable: '--font-caveat',
    weight: ['400'],
    subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
    title: 'Crazy Snails',
    description: 'Discover the world by traveling',
    icons: {
        icon: ['/favicon.ico'],
    },
};

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(
    props: Readonly<{
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }>,
) {
    const { locale } = (await props.params) as { locale: Locale };

    const dictionary = await getDictionary(locale);

    let activityTypes: string[] = [];
    if (!process.env.CS_API) {
        console.error('CS_API is not configured, skipping activity types fetch and falling back to an empty list.');
    } else {
        try {
            const activityTypesResponse = await fetch(`${process.env.CS_API}/albums/activity-types`);
            if (!activityTypesResponse.ok) {
                throw new Error(`Activity types request failed with status ${activityTypesResponse.status}`);
            }
            activityTypes = await activityTypesResponse.json();
        } catch (e) {
            console.error('Failed to fetch activity types, falling back to an empty list:', e);
        }
    }

    return (
        <html lang={locale}>
            <body className={`${pacifico.variable} ${raleway.variable} ${caveat.variable} flex min-h-dvh flex-col`}>
                <DictionaryProvider dictionary={dictionary}>
                    <ActivityTypesProvider activities={activityTypes}>
                        <ToastMessageProvider>
                            <ToastMessageWrapper>
                                <div>{props.children}</div>
                                {/* <Footer locale={locale} /> */}
                            </ToastMessageWrapper>
                        </ToastMessageProvider>
                    </ActivityTypesProvider>
                </DictionaryProvider>
            </body>
        </html>
    );
}
