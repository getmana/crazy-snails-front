import Bicycle from '@/public/icons/bicycle.svg';
import Camping from '@/public/icons/camping-icon.svg';
import CircleExclamation from '@/public/icons/circle-exclamation.svg';
import CloseCircle from '@/public/icons/close-circle-1.svg';
import Logo from '@/public/icons/logo.svg';

export const IconMap = {
    Bicycle,
    Camping,
    CircleExclamation,
    CloseCircle,
    Logo,
};

export const IconAriaLabelMap: Record<keyof typeof IconMap, string> = {
    Bicycle: 'Bicycle Icon',
    Camping: 'Camping Icon',
    CircleExclamation: 'Circle Exclamation Icon',
    CloseCircle: 'Close Circle Icon',
    Logo: 'Crazy Snails Logo',
};
