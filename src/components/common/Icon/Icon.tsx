import { IconAriaLabelMap, IconMap } from './IconMap';

type IconProps = {
    icon: keyof typeof IconMap;
    className?: string;
    fill?: string;
};

export const Icon = ({ icon, className = '', fill }: IconProps) => {
    const IconComponent: React.FC<React.SVGProps<SVGSVGElement>> = IconMap[icon];
    if (IconComponent === undefined) {
        console.error(`An icon rendered using the Icon component could not be rendered: ${icon}`);
        return null;
    }

    return <IconComponent className={className} aria-label={IconAriaLabelMap[icon]} fill={fill} />;
};
