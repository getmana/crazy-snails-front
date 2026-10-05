import Image from 'next/image';

import { StoryPhotoJoin } from '@/types';
import { getPhotoUrl } from '@/utils';

type StoryPairProps = { items: StoryPhotoJoin[] };

export const StoryPair = ({ items }: StoryPairProps) => {
    const sorted = items.slice().sort((a, b) => a.position - b.position);

    return (
        <div className="flex w-full gap-2">
            {sorted.map((item) => (
                <div key={item.photoId} className="relative aspect-[5/4] w-1/2 overflow-hidden rounded-lg">
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
