import Link from 'next/link';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

export const StoriesSection = ({ dictionary, locale }: { dictionary: DictionaryType; locale: Locale }) => {
    const { subtitle, title, button } = dictionary;

    return (
        <section className="section">
            <Heading heading={title.stories} className="heading-3" headingTag="h1" subheading={subtitle.stories} />
            <div className="content">
                <div className="flex justify-center">
                    <Link href={`/${locale}/stories`} className="btn-primary block">
                        {button.readAll}
                    </Link>
                </div>
            </div>
        </section>
    );
};
