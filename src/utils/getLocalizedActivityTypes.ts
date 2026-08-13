import { Locale } from '@/i18n-config';

export const getLocalizedActivityTypes = ({ activity, locale }: { activity: string; locale: Locale }): string => {
    switch (activity) {
        case 'hiking':
            return { en: 'hiking', uk: 'хайкінг' }[locale];
        case 'tracking':
            return { en: 'tracking', uk: 'трекінг' }[locale];
        case 'cycling':
            return { en: 'cycling', uk: 'вело' }[locale];
        case 'auto':
            return { en: 'auto', uk: 'авто' }[locale];
        case 'motorcycle':
            return { en: 'motorcycle', uk: 'мото' }[locale];
        case 'city':
            return { en: 'city', uk: 'місто' }[locale];
        default:
            console.error('Unknown activity type. Add translation for ', activity);
            return { en: activity, uk: activity }[locale];
    }
};
