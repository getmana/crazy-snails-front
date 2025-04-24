import Bicycle from '@/public/icons/bicycle.svg';
import Logo from '@/public/icons/logo.svg';

export const IconMap = {
    Logo,
    Bicycle,
};

export const IconAriaLabelMap: Record<keyof typeof IconMap, string> = {
    Logo: 'Crazy Snails Logo',
    Bicycle: 'Bicycle Icon',
};
