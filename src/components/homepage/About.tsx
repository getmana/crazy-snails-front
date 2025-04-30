'use client';

import { useRef, useState } from 'react';

export const About = ({ text, buttonText, title }: { text: string[]; buttonText: string; title: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="content pt-16 md:pt-32 lg:pt-48">
            <div className="bg-common-green gap-10 p-10 md:flex">
                <div className="min-w-2/5">
                    <h1 className="heading-1">{title}</h1>
                </div>
                <div className="font-semibold text-white">
                    {text.slice(0, 4).map((p) => (
                        <p key={p.slice(0, 100)}>{p}</p>
                    ))}
                    <button className={`btn-secondary mt-4 ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        {buttonText}
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
                            {text.slice(4).map((p) => (
                                <p key={p.slice(0, 100)}>{p}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
