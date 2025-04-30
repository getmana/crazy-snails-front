import Link from 'next/link';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

export const StoriesSection = ({ dictionary, locale }: { dictionary: DictionaryType; locale: Locale }) => {
    return (
        <section className="section">
            <Heading heading={dictionary.title.stories} className="heading-3" headingTag="h1" subheading={dictionary.subtitle.stories} />
            <div className="content">
                <div className="flex justify-center">
                    <Link href={`/${locale}/stories`} className="btn-primary block">
                        {dictionary.button.readAll}
                    </Link>
                </div>
            </div>
        </section>
    );
};
