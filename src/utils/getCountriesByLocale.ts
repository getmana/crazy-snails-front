import { getCountries } from '@/api/getCountries';
import { SelectOption } from '@/components/common/FormElements/Select';
import { Locale } from '@/i18n-config';

import { getLocalizedName } from './getLocalizedField';

export const getCountriesByLocale = async (locale: Locale): Promise<SelectOption[]> => {
    const countries = await getCountries();
    return countries.map((country) => ({
        id: country.id,
        name: country[getLocalizedName(locale)],
    }));
};
