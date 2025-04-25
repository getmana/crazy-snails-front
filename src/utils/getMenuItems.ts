import { Locale } from '@/i18n-config';

export type MenuItem = { link: string; text: string };

export const getMenuItems = (menu: { [key: string]: string }, locale: Locale): MenuItem[] =>
    Object.entries(menu).map(([key, value]) => ({
        link: key === 'home' ? `/${locale}` : `/${locale}/${key}`,
        text: value,
    }));
