import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const PLACEHOLDER_IMAGE_URL = '/images/IMG_4490.JPG';

type PreviewCardProps = {
    href: string;
    imageUrl: string | null;
    title: string;
    excerpt?: string;
    readMoreLabel: string;
    children?: React.ReactNode;
};

export const PreviewCard = ({ href, imageUrl, title, excerpt, readMoreLabel, children }: PreviewCardProps) => (
    <Link href={href} className="group block">
        <Card className="gap-0 overflow-hidden rounded-lg border-none p-0 shadow-none">
            <div className="bg-accent relative aspect-[440/236] w-full">
                <Image
                    src={imageUrl ?? PLACEHOLDER_IMAGE_URL}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
                />
                <div className="bg-grey-nav/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full border-2 border-white px-6 py-2 text-sm font-bold text-white uppercase">
                        {readMoreLabel}
                    </span>
                </div>
            </div>
            <CardContent className="px-7 py-5">
                <CardTitle className="text-background-footer line-clamp-1 text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-foreground mt-1 line-clamp-2 min-h-12 text-base">{excerpt}</CardDescription>
                {children}
            </CardContent>
        </Card>
    </Link>
);
