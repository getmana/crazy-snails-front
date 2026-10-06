import { deleteAlbumWithRedirect } from '@/actions/deleteAlbum';
import { fetchWithAuth } from '@/api/authFetch';
import { AdminListRow, ToastMessage } from '@/components';
import { Locale } from '@/i18n-config';
import { OwnAlbumsResponse, SearchParams } from '@/types';
import { getDictionary } from '@/utils';

export default async function AdminAlbumsList(props: { params: Promise<{ locale: Locale }>; searchParams: Promise<SearchParams> }) {
    const { locale } = await props.params;
    const { toast = null } = await props.searchParams;

    const {
        title,
        editAlbumForm: { editBtn, deleteBtn, confirmDelete, cancelBtn },
        adminAlbumsList: { publishedLabel, draftLabel, emptyMessage },
    } = await getDictionary(locale);
    const labels = {
        edit: editBtn,
        delete: deleteBtn,
        published: publishedLabel,
        draft: draftLabel,
        confirmDelete,
        cancel: cancelBtn,
    };

    const response = await fetchWithAuth(`/albums/mine`);
    const albumsData: OwnAlbumsResponse = await response.json();

    return (
        <div className="flex w-full flex-col px-8">
            {toast ? <ToastMessage toast={toast} /> : null}
            <h1 className="heading-3 py-8">{title.myAlbums}</h1>
            {albumsData.items.length === 0 ? (
                <p className="text-muted-foreground">{emptyMessage}</p>
            ) : (
                <div className="divide-border divide-y border-y">
                    {albumsData.items.map((album) => (
                        <AdminListRow
                            key={album.id}
                            item={album}
                            locale={locale}
                            viewHref={`/${locale}/dashboard/albums/${album.id}`}
                            editHref={`/${locale}/dashboard/albums/${album.id}/edit`}
                            deleteAction={deleteAlbumWithRedirect.bind(null, album.id)}
                            labels={labels}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
