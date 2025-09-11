'use client';

import { useRef, useState } from 'react';

import { useDictionary } from '@/context';

export const About = () => {
    const { about, button, title } = useDictionary();
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="content pt-16 md:pt-32 lg:pt-48">
            <div className="bg-common-green gap-10 p-10 md:flex">
                <div className="min-w-2/5">
                    <h1 className="heading-1 text-center">{title.aboutSection}</h1>
                </div>
                <div className="font-semibold text-white">
                    {about.slice(0, 4).map((p) => (
                        <p key={p.slice(0, 100)}>{p}</p>
                    ))}
                    <button className={`btn-secondary mt-4 ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        {button.readMore}
                    </button>
                    <div
                        ref={contentRef}
                        className="overflow-hidden transition-all duration-300"
                        style={{
                            height: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        <div className="">
                            {about.slice(4).map((p) => (
                                <p key={p.slice(0, 100)}>{p}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
