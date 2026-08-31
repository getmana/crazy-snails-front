import { ToastMessage } from '@/components/common/ToastMessage';
import { Locale } from '@/i18n-config';

export type SearchParams = {
    toast?: string;
};

export default async function AlbumAdminPage(props: {
    params: Promise<{ id: string; locale: Locale }>;
    searchParams: Promise<SearchParams>;
}) {
    const { id, locale } = await props.params;
    const { toast = null } = await props.searchParams;

    return (
        <div className="flex w-full flex-col px-8">
            <h1 className="heading-3 py-8">{`album id = ${id}`}</h1>
            {toast ? <ToastMessage toast={toast} /> : null}
        </div>
    );
}
