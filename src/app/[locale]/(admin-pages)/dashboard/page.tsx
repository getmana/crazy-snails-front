import Link from 'next/link';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Dashboard(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="section flex w-full flex-col items-center px-8">
            <Heading heading={title.dashboard} className="heading-3" headingTag="h1" />
            <div className="w-full bg-white px-8 py-12 md:w-2xl">
                <ul className="list-disc">
                    <li>
                        <Link href={`/${locale}/dashboard/create-album`}>{title.createAlbum}</Link>
                    </li>
                    <li>
                        <Link href={`/${locale}/dashboard/edit-user`}>{title.editUser}</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
