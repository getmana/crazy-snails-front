import Link from 'next/link';

import { Icon } from '@/components';
import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

export const GrandpaSection = ({ dictionary, locale }: { dictionary: DictionaryType; locale: Locale }) => {
    const { title, button } = dictionary;
    return (
        <section className="grandpa-section">
            <div className="relative z-10 flex flex-col items-center">
                <Link href={`/${locale}/grandpa`}>
                    <div className="flex flex-col items-center gap-6 pb-24 md:flex-row">
                        <Icon icon="Bicycle" className="grandpa-section-icon h-16 w-16 text-white md:h-32 md:w-32" />
                        <h2 className="heading-2 text-center">{title.grandpaSection}</h2>
                        <Icon icon="Camping" className="grandpa-section-icon hidden h-26 w-26 text-white md:flex" />
                    </div>
                </Link>
                <Link href={`/${locale}/grandpa`} className="btn-secondary block">
                    {button.goToAlbum}
                </Link>
            </div>
        </section>
    );
};
