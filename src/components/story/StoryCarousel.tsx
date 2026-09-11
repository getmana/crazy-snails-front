'use client';

import Image from 'next/image';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StoryPhotoJoin } from '@/types';
import { getPhotoUrl } from '@/utils';

export const StoryCarousel = ({ items }: { items: StoryPhotoJoin[] }) => {
    const sorted = items.slice().sort((a, b) => a.position - b.position);

    return (
        <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent className="ml-0">
                {sorted.map((item) => (
                    <CarouselItem key={item.photoId} className="pl-0">
                        <div className="relative aspect-[3/2] w-full">
                            <Image
                                src={getPhotoUrl(item.photo.thumbnailMdKey ?? item.photo.originalKey)}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                alt=""
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 border-none bg-white text-black hover:bg-white/90" />
            <CarouselNext className="right-4 border-none bg-white text-black hover:bg-white/90" />
        </Carousel>
    );
};
