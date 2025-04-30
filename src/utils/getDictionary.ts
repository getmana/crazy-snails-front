import type { Locale } from '@/i18n-config';

import en from '../dictionaries/en.json';

export type DictionaryType = typeof en;

const dictionaries = {
    en: () => import('../dictionaries/en.json').then((module) => module.default),
    uk: () => import('../dictionaries/uk.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en();
