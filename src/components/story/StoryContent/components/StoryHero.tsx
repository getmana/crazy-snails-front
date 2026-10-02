import Image from 'next/image';

import { Photo } from '@/types';
import { getPhotoUrl } from '@/utils';

export const StoryHero = ({ photo }: { photo: Photo }) => (
    <Image src={getPhotoUrl(photo.originalKey)} alt="" width={1600} height={900} sizes="100vw" className="h-auto w-full rounded-lg" />
);
