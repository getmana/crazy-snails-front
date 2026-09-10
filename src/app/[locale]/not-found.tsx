'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Header, Icon } from '@/components';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';

export default function NotFound() {
    const { locale } = useParams<{ locale: Locale }>();
    const { notFoundPage } = useDictionary();

    return (
        <div className="flex min-h-dvh flex-col">
            <Header locale={locale} />
            <div className="content flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
                <h1 className="heading-3">{notFoundPage.heading}</h1>
                <p className="text-foreground max-w-md">{notFoundPage.message}</p>
                <Link href={`/${locale}`} className="btn-primary">
                    {notFoundPage.homeBtn}
                </Link>
            </div>
        </div>
    );
}
