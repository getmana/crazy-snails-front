import Bicycle from '@/public/icons/bicycle.svg';
import Camping from '@/public/icons/camping-icon.svg';
import Logo from '@/public/icons/logo.svg';

export const IconMap = {
    Bicycle,
    Camping,
    Logo,
};

export const IconAriaLabelMap: Record<keyof typeof IconMap, string> = {
    Camping: 'Camping Icon',
    Bicycle: 'Bicycle Icon',
    Logo: 'Crazy Snails Logo',
};
