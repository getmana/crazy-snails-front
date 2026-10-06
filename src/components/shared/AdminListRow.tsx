import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { Icon } from '@/components/shared/Icon/Icon';
import { Button, buttonVariants } from '@/components/ui/button';
import { PLACEHOLDER_IMAGE_URL } from '@/constants';
import { Locale } from '@/i18n-config';
import { AdminListItem } from '@/types';
import { getPhotoUrl, resolveLocalizedValue } from '@/utils';

type AdminListRowProps = {
    item: AdminListItem;
    locale: Locale;
    viewHref: string;
    editHref: string;
    deleteAction: () => Promise<string | undefined>;
    labels: {
        edit: string;
        delete: string;
        published: string;
        draft: string;
        confirmDelete: string;
        cancel: string;
    };
};

export const AdminListRow = ({ item, locale, viewHref, editHref, deleteAction, labels }: AdminListRowProps) => {
    const localizedTitle = resolveLocalizedValue(item.titleEn, item.titleUk, item.title, locale) ?? '';
    const localizedSubtitle = resolveLocalizedValue(item.subtitleEn, item.subtitleUk, item.subtitle, locale) ?? undefined;

    return (
        <div className="hover:bg-accent flex items-center gap-4 px-2 py-3 transition-colors">
            <Link href={viewHref} className="flex min-w-0 flex-1 items-center gap-4">
                <Image
                    src={item.photo ? getPhotoUrl(item.photo.thumbnailSmKey || item.photo.originalKey) : PLACEHOLDER_IMAGE_URL}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-md object-cover"
                />

                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{localizedTitle}</p>
                    {localizedSubtitle && <p className="text-muted-foreground truncate text-sm">{localizedSubtitle}</p>}
                </div>
            </Link>

            <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm">
                <span
                    role="checkbox"
                    aria-checked={item.isPublished}
                    aria-readonly
                    data-state={item.isPublished ? 'checked' : 'unchecked'}
                    className="border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-[4px] border"
                >
                    {item.isPublished && <CheckIcon className="size-3.5" />}
                </span>
                <span className="w-28 whitespace-nowrap">{item.isPublished ? labels.published : labels.draft}</span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Link href={editHref} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    {labels.edit}
                </Link>
                <DeleteConfirmDialog
                    action={deleteAction}
                    title={labels.confirmDelete}
                    confirmLabel={labels.delete}
                    cancelLabel={labels.cancel}
                    trigger={
                        <Button type="button" variant="destructive" size="icon-sm" aria-label={labels.delete}>
                            <Icon icon="TrashBin" className="size-4" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
};
