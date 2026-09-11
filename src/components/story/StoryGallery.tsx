import Image from 'next/image';

import { StoryPhotoJoin } from '@/types';
import { getPhotoUrl } from '@/utils';

export const StoryGallery = ({ items }: { items: StoryPhotoJoin[] }) => {
    const [big, ...rest] = items.slice().sort((a, b) => a.position - b.position);

    return (
        <div className="flex w-full gap-2">
            <div className="relative aspect-[3/4] w-1/2">
                <Image
                    src={getPhotoUrl(big.photo.thumbnailMdKey ?? big.photo.originalKey)}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    alt=""
                />
            </div>
            <div className="flex w-1/2 flex-col gap-2">
                {rest.map((item) => (
                    <div key={item.photoId} className="relative aspect-[3/2] w-full">
                        <Image
                            src={getPhotoUrl(item.photo.thumbnailMdKey ?? item.photo.originalKey)}
                            fill
                            className="object-cover"
                            sizes="50vw"
                            alt=""
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
