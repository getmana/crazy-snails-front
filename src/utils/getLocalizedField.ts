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

type FieldToLocalize = 'title' | 'description';

const getLocalizedField = <Base extends FieldToLocalize>(base: Base) => {
    return <L extends Locale>(locale: L): `${Base}${LocaleSuffixMap[L]}` => `${base}${localeSuffixMap[locale]}` as const;
};

export const getLocalizedTitle = getLocalizedField('title');
export const getLocalizedDescription = getLocalizedField('description');
