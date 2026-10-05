import { Locale } from '@/i18n-config';

export type NavLink = { link: string; text: string };

export const getMenuItems = (menu: { [key: string]: string }, locale: Locale): NavLink[] =>
    Object.entries(menu).map(([key, value]) => ({
        link: key === 'home' ? `/${locale}` : `/${locale}/${key}`,
        text: value,
    }));
