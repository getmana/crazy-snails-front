import Bicycle from '@/public/icons/bicycle.svg';
import Camping from '@/public/icons/camping-icon.svg';
import CircleExclamation from '@/public/icons/circle-exclamation.svg';
import CloseCircle from '@/public/icons/close-circle-1.svg';
import Eye from '@/public/icons/eye.svg';
import EyeOff from '@/public/icons/eye-off.svg';
import Logo from '@/public/icons/logo.svg';

export const IconMap = {
    Bicycle,
    Camping,
    CircleExclamation,
    CloseCircle,
    Eye,
    EyeOff,
    Logo,
};

export const IconAriaLabelMap: Record<keyof typeof IconMap, string> = {
    Bicycle: 'Bicycle Icon',
    Camping: 'Camping Icon',
    CircleExclamation: 'Circle Exclamation Icon',
    CloseCircle: 'Close Circle Icon',
    Eye: 'Eye Icon',
    EyeOff: 'Eye Off Icon',
    Logo: 'Crazy Snails Logo',
};
