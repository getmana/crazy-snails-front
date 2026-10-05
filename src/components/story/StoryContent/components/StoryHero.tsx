import Image from 'next/image';

import { Photo } from '@/types';
import { getPhotoUrl } from '@/utils';

type StoryHeroProps = { photo: Photo };

export const StoryHero = ({ photo }: StoryHeroProps) => (
    <Image src={getPhotoUrl(photo.originalKey)} alt="" width={1600} height={900} sizes="100vw" className="h-auto w-full rounded-lg" />
);
