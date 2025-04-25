import Link from 'next/link';

import { Locale } from '@/i18n-config';
import { getMenuItems } from '@/utils';

type MenuItemProps = {
    items: { [key: string]: string };
    locale: Locale;
    textClassName: string;
    activeLink?: string;
    hasDivider?: boolean;
};

export const MenuItems = ({ items, locale, textClassName, activeLink = '', hasDivider = false }: MenuItemProps) => {
    const menuItems = getMenuItems(items, locale);

    return (
        <ul className="flex gap-4 pt-6">
            <Link href={`/${locale}/grandpa`}>
                <li>Grandpa</li>
            </Link>
            {menuItems.map(({ link, text }, i, arr) => (
                <Link key={text} href={link} className="flex">
                    <li
                        className={`${textClassName} ${activeLink === link ? 'border-common-green border-b-4' : ''} font-extrabold uppercase`}
                    >
                        {text}
                    </li>
                    {hasDivider && i !== arr.length - 1 ? <span className="font-caveat text-custom-blue px-4">/</span> : null}
                </Link>
            ))}
        </ul>
    );
};
