import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import uk from 'i18n-iso-countries/langs/uk.json';

import { i18n, Locale } from '@/i18n-config';

countries.registerLocale(en);
countries.registerLocale(uk);

type Country = {
    code: string;
    name: string;
};

export type CountryList = Country[];
// TODO remove package and populate DB countries table
export function getCountries(locale: Locale = i18n.defaultLocale): CountryList {
    const names = countries.getNames(locale, { select: 'official' });

    return Object.entries(names).map(([code, name]) => ({ code, name }));
}
