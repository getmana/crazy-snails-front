'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';

export default function AdminNotFound() {
    const { locale } = useParams<{ locale: Locale }>();
    const { notFoundPage } = useDictionary();

    return (
        <div className="flex w-full flex-col items-center gap-6 px-8 py-24 text-center">
            <h1 className="heading-3">{notFoundPage.heading}</h1>
            <p className="text-foreground max-w-md">{notFoundPage.message}</p>
            <Link href={`/${locale}/dashboard`} className="btn-primary">
                {notFoundPage.dashboardBtn}
            </Link>
        </div>
    );
}
