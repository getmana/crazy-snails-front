'use client';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components';
import { Locale } from '@/i18n-config';

import { MenuItems } from './MenuItems';

type FooterProps = {
    items: { [key: string]: string };
    locale: Locale;
};

export const Footer = ({ items, locale }: FooterProps) => {
    const pathname = usePathname();
    const isCustom = !!pathname.match(/^\/(en|uk)\/grandpa$/);
    const textStyle = isCustom ? 'text-foreground-custom font-caveat' : 'text-grey-footer-text';

    return (
        <footer className={`${isCustom ? 'bg-brown-light' : 'bg-background-footer'}`}>
            <div className="content">
                <div
                    className={`${isCustom ? 'border-brown-light-15' : 'border-grey-footer-text-15'} flex items-center justify-between border-b`}
                >
                    <MenuItems items={items} locale={locale} textClassName={textStyle} hasDivider={isCustom} isFooter={true} />
                    <Icon icon="Logo" className={`${textStyle} h-32 w-md`} />
                </div>
                <p className={`${textStyle} py-6 text-center`}>Copyright CrazySnails 2025</p>
            </div>
        </footer>
    );
};
