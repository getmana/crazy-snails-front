'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components';
import { Locale } from '@/i18n-config';

import { MenuItems } from './MenuItems';

type FooterProps = {
    locale: Locale;
};

export const Footer = ({ locale }: FooterProps) => {
    const pathname = usePathname();
    const isCustom = !!pathname.match(/^\/(en|uk)\/grandpa$/);
    const textStyle = isCustom ? 'text-foreground-custom font-caveat' : 'text-grey-footer-text';

    return (
        <footer className={`${isCustom ? 'bg-brown-light' : 'bg-background-footer'}`}>
            <div className="content">
                <div
                    className={`${isCustom ? 'border-brown-light-15' : 'border-grey-footer-text-15'} flex flex-col-reverse items-center justify-between border-b md:flex-row`}
                >
                    <MenuItems locale={locale} textClassName={textStyle} hasDivider={isCustom} isFooter={true} />
                    <Link href={`/${locale}`}>
                        <Icon icon="Logo" className={`${textStyle} h-24 w-xs md:h-32 md:w-md`} />
                    </Link>
                </div>
                <p className={`${textStyle} py-6 text-center`}>Copyright CrazySnails 2025</p>
            </div>
        </footer>
    );
};
