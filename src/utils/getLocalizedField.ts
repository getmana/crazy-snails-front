import { i18n, Locale } from '@/i18n-config';

import { capitalizeFirstLetter } from './capitalizeFirstLetter';

type LocaleSuffixMap = {
    [K in Locale]: Capitalize<K>;
};

// const localeSuffixMap = {
//     uk: 'Uk',
//     en: 'En',
// } as const satisfies LocaleSuffixMap;

const localeSuffixMap = Object.fromEntries(
    i18n.locales.map((locale) => [locale, capitalizeFirstLetter(locale)] as const),
) as LocaleSuffixMap;

type FieldToLocalize = 'title' | 'description' | 'name' | 'subtitle' | 'caption';

const getLocalizedField = <Base extends FieldToLocalize>(base: Base) => {
    return <L extends Locale>(locale: L): `${Base}${LocaleSuffixMap[L]}` => `${base}${localeSuffixMap[locale]}` as const;
};

export const getLocalizedTitle = getLocalizedField('title');
export const getLocalizedSubtitle = getLocalizedField('subtitle');
export const getLocalizedDescription = getLocalizedField('description');
export const getLocalizedName = getLocalizedField('name');
export const getLocalizedCaption = getLocalizedField('caption');

// Prefers `en`/`uk` matching the given locale, falls back to the plain base field (already cross-locale-resolved on write, see EditStoryForm's buildPayload).
export const resolveLocalizedValue = <V>(
    en: V | null | undefined,
    uk: V | null | undefined,
    base: V | null | undefined,
    locale: Locale,
): V | null => {
    const preferred = locale === 'en' ? en : uk;
    return (preferred || base) ?? null;
};
