'use client';

import Image from 'next/image';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Locale } from '@/i18n-config';
import { CarouselPhotoJoin } from '@/types';
import { getPhotoUrl, resolveLocalizedValue } from '@/utils';

import { CarouselCaption } from './CarouselCaption';

export const StoryCarousel = ({ items, locale }: { items: CarouselPhotoJoin[]; locale: Locale }) => {
    const sorted = items.slice().sort((a, b) => a.position - b.position);

    return (
        <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent className="ml-0">
                {sorted.map((item) => {
                    const {
                        captionEn,
                        captionUk,
                        caption,
                        photoId,
                        photo: { thumbnailMdKey, originalKey },
                    } = item;
                    const localizedCaption = resolveLocalizedValue(captionEn, captionUk, caption, locale);

                    return (
                        <CarouselItem key={photoId} className="pl-0">
                            <div className="relative aspect-[3/2] max-h-[90vh] w-full overflow-hidden rounded-lg bg-white/50">
                                <Image
                                    src={getPhotoUrl(thumbnailMdKey ?? originalKey)}
                                    alt=""
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                                <CarouselCaption caption={localizedCaption} />
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious className="left-4 border-none bg-white text-black hover:bg-white/90" />
            <CarouselNext className="right-4 border-none bg-white text-black hover:bg-white/90" />
        </Carousel>
    );
};
