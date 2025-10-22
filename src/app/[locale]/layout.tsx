import type { Metadata } from 'next';
import { Caveat, Pacifico, Raleway } from 'next/font/google';

import { Footer } from '@/components';
import { ToastMessageWrapper } from '@/components/common/ToastMessageWrapper';
import { DictionaryProvider, ToastMessageProvider } from '@/context';
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
        params: Promise<{ locale: Locale }>;
    }>,
) {
    const { locale } = await props.params;

    const dictionary = await getDictionary(locale);

    return (
        <html lang={locale}>
            <body className={`${pacifico.variable} ${raleway.variable} ${caveat.variable} flex min-h-dvh flex-col`}>
                <DictionaryProvider dictionary={dictionary}>
                    <ToastMessageProvider>
                        <ToastMessageWrapper>
                            <div>{props.children}</div>
                            {/* <Footer locale={locale} /> */}
                        </ToastMessageWrapper>
                    </ToastMessageProvider>
                </DictionaryProvider>
            </body>
        </html>
    );
}
