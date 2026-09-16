'use client';

import { Info, X } from 'lucide-react';
import { useState } from 'react';

export const CarouselCaption = ({ caption }: { caption?: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!caption) return null;

    return (
        <div className="absolute inset-x-0 bottom-0">
            {isOpen && (
                <div className="bg-white/80 px-4 py-3 backdrop-blur-sm">
                    <p className="text-grey-nav pr-8 text-sm">{caption}</p>
                </div>
            )}
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Hide photo caption' : 'Show photo caption'}
                className="bg-grey-nav/60 hover:bg-grey-nav/80 absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full text-white transition-colors"
            >
                {isOpen ? <X className="size-4" /> : <Info className="size-4" />}
            </button>
        </div>
    );
};
