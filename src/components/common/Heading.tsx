import React from 'react';

type HeadingProps = {
    heading: string;
    headingTag: 'h1' | 'h2';
    subheading: string;
    className: string;
    subheadingClassName?: string;
};

export const Heading = ({ heading, headingTag, subheading, className, subheadingClassName = '' }: HeadingProps) => {
    const Tag = (headingTag as keyof React.JSX.IntrinsicElements) ?? 'h2';
    return (
        <div className="content text-center">
            <div className="flex justify-center gap-6">
                <div className="border-grey-border my-auto flex-grow border-t" />
                <Tag className={className}>{heading}</Tag>
                <div className="border-grey-border my-auto flex-grow border-t" />
            </div>
            <h3 className={subheadingClassName}>{subheading}</h3>
        </div>
    );
};
