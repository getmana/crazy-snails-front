import Link from 'next/link';

import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Dashboard(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{title.dashboard}</h1>
            <div className="w-full px-8 py-12 md:w-2xl">
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
