export type Country = {
    id: number;
    name_en: string;
    name_uk: string;
};

export const getCountries = async (): Promise<Country[]> => {
    if (!process.env.CS_API) {
        console.error('CS_API is not configured, skipping countries fetch and falling back to an empty list.');
        return [];
    }

    try {
        const response = await fetch(`${process.env.CS_API}/countries`);
        if (!response.ok) {
            throw new Error(`Countries request failed with status ${response.status}`);
        }
        const countries: Country[] = await response.json();

        return countries;
    } catch (e) {
        console.error('Failed to fetch countries, falling back to an empty list:', e);
        return [];
    }
};
