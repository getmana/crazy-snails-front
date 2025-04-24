import Link from 'next/link';

import { Icon } from '@/components';

type HeaderProps = {
    items: { link: string; text: string }[];
    bgClassName?: string;
    hasBorder?: boolean;
};

export const Header = ({ items, bgClassName = '', hasBorder = false }: HeaderProps) => {
    return (
        <header className={`content ${bgClassName}`}>
            <div className={`${hasBorder ? 'border-grey-blue-border border-b' : ''} flex items-center justify-between`}>
                <Icon icon="Logo" className="text-grey-nav h-32 w-md" />
                <ul className="flex gap-4 pt-6">
                    {items.map(({ link, text }) => (
                        <Link key={text} href={link}>
                            <li className="text-grey-nav font-extrabold uppercase">{text}</li>
                        </Link>
                    ))}
                </ul>
            </div>
        </header>
    );
};
