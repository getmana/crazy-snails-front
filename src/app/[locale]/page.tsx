import Image from 'next/image';

import { Header, Icon } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

const getMenuItems = (menu: { [key: string]: string }, locale: Locale) =>
    Object.entries(menu).map(([key, value]) => ({
        link: key === 'home' ? `/${locale}` : `/${locale}/${key}`,
        text: value,
    }));

export default async function Home(props: { params: Promise<{ locale: Locale }> }) {
    const params = await props.params;
    console.log('params=====', params);

    const dictionary = await getDictionary(params.locale);
    console.log(getMenuItems(dictionary.menu, params.locale));

    return (
        <div className="bg-home bg-center-top bg-cover">
            <Header items={getMenuItems(dictionary.menu, params.locale)} hasBorder={true} />
            {/* <header className="content">
                <div className="border-grey-blue-border flex items-center justify-between border-b">
                    <Icon icon="Logo" className="text-grey-nav h-32 w-md" />
                    <ul className="flex gap-4 pt-6">
                        {Object.values(dictionary.menu).map((item) => (
                            <li className="text-grey-nav font-extrabold uppercase" key={item}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </header> */}
            <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
                <Icon icon="Bicycle" className="h-16 w-16 text-green-900" />
                <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm/6 sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        Get started by editing{' '}
                        <code className="rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
                    <li className="font-raleway">This is another font</li>
                </ol>
                <h1 className="font-pacifico text-5xl">Hello World</h1>
                <h1 className="font-pacifico">А якщо кирилиця...</h1>
                <h2 className="font-pacifico text-common-green text-2xl">Історії</h2>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <a
                        className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
                        Deploy now
                    </a>
                    <a
                        className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
