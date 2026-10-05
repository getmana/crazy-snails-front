import Link from 'next/link';

import { Icon } from '@/components/shared/Icon/Icon';
import { Locale } from '@/i18n-config';

export const HeaderAdmin = ({ locale }: { locale: Locale }) => {
    return (
        <header className="bg-white">
            <div className="content">
                <div className="flex items-center justify-between">
                    <Link href={`/${locale}`}>
                        <Icon icon="Logo" className="h-32 w-md" />
                    </Link>
                </div>
            </div>
        </header>
    );
};
