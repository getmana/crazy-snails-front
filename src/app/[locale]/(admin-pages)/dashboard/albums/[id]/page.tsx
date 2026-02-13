import { headers } from 'next/headers';

import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';

export default async function AlbumAdminPage(props: { params: Promise<{ id: string; locale: Locale }> }) {
    const { id, locale } = await props.params;

    const headersList = await headers();
    const searchString = headersList.get('x-search');
    const toast = searchString ? new URLSearchParams(searchString).get('toast') : null;
    console.log('toast==>', toast);

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{`album id = ${id}`}</h1>
            {toast ? <ToastMessage toast={toast} /> : null}
        </div>
    );
}
