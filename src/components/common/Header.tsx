'use client';

import Link from 'next/link';

import { Icon, LocaleSwitcher } from '@/components';
import { Locale } from '@/i18n-config';

import { MenuItems } from './MenuItems';

type HeaderProps = {
    locale: Locale;
    bgClassName?: string;
    hasBorder?: boolean;
    textClassName?: string;
    hasDivider?: boolean;
};

export const Header = ({
    hasBorder = false,
    locale,
    bgClassName = '',
    textClassName = 'text-grey-nav',
    hasDivider = false,
}: HeaderProps) => {
    return (
        <header className={bgClassName}>
            <div className="content">
                <div className={`${hasBorder ? 'border-grey-blue-border border-b' : ''} flex items-center justify-between`}>
                    <Link href={`/${locale}`}>
                        <Icon icon="Logo" className={`${textClassName} h-32 w-md`} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <MenuItems locale={locale} textClassName={textClassName} hasDivider={hasDivider} />
                        <LocaleSwitcher locale={locale} />
                    </div>
                </div>
            </div>
        </header>
    );
};
