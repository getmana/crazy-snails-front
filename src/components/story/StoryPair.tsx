import Image from 'next/image';

import { StoryPhotoJoin } from '@/types';
import { getPhotoUrl } from '@/utils';

export const StoryPair = ({ items }: { items: StoryPhotoJoin[] }) => {
    const sorted = items.slice().sort((a, b) => a.position - b.position);

    return (
        <div className="flex w-full gap-2">
            {sorted.map((item) => (
                <div key={item.photoId} className="relative aspect-[5/4] w-1/2">
                    <Image
                        src={getPhotoUrl(item.photo.thumbnailMdKey ?? item.photo.originalKey)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                </div>
            ))}
        </div>
    );
};
