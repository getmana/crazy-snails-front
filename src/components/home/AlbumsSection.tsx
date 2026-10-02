import Link from 'next/link';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

export const AlbumsSection = ({ dictionary, locale }: { dictionary: DictionaryType; locale: Locale }) => {
    const { title, subtitle, button } = dictionary;

    return (
        <section className="section">
            <Heading heading={title.albums} className="heading-3" headingTag="h1" subheading={subtitle.albumsSection} />
            <div className="content">
                <div className="flex justify-center">
                    <Link href={`/${locale}/albums`} className="btn-primary block">
                        {button.allAlbums}
                    </Link>
                </div>
            </div>
        </section>
    );
};
