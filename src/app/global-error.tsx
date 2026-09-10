'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import '@/styles/globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
                <h1 className="text-common-green text-4xl font-bold">Even the snails got stuck</h1>
                <p className="text-foreground max-w-md">Something went wrong on our end. Give it another try, or head back home.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button type="button" onClick={reset} className="btn-primary">
                        Try again
                    </button>
                    <Link href="/" className="btn-outline">
                        Back home
                    </Link>
                </div>
            </body>
        </html>
    );
}
