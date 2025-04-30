import Link from 'next/link';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

export const AlbumsSection = ({ dictionary, locale }: { dictionary: DictionaryType; locale: Locale }) => {
    return (
        <section className="section">
            <Heading
                heading={dictionary.title.albums}
                className="heading-3"
                headingTag="h1"
                subheading={dictionary.subtitle.albumsSection}
            />
            <div className="content">
                <div className="flex justify-center">
                    <Link href={`/${locale}/albums`} className="btn-primary block">
                        {dictionary.button.allAlbums}
                    </Link>
                </div>
            </div>
        </section>
    );
};
