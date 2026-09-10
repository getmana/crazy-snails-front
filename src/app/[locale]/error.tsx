'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { Header, Icon } from '@/components';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const { locale } = useParams<{ locale: Locale }>();
    const { errorPage } = useDictionary();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col">
            <Header locale={locale} />
            <div className="content flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
                <h1 className="heading-3">{errorPage.heading}</h1>
                <p className="text-foreground max-w-md">{errorPage.message}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button type="button" onClick={reset} className="btn-primary">
                        {errorPage.retryBtn}
                    </button>
                    <Link href={`/${locale}`} className="btn-outline">
                        {errorPage.homeBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
}
