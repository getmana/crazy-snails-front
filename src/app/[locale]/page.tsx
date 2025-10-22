import { About, AlbumsSection, Footer, GrandpaSection, Header, StoriesSection } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Home(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;
    const dictionary = await getDictionary(locale);

    return (
        <div className="w-full">
            <div className="bg-home aspect-[4/3] w-full bg-cover bg-top bg-no-repeat pb-36">
                <Header locale={locale} hasBorder={true} />
                <About />
            </div>
            <main className="">
                <StoriesSection locale={locale} dictionary={dictionary} />
                <GrandpaSection locale={locale} dictionary={dictionary} />
                <AlbumsSection locale={locale} dictionary={dictionary} />

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
            </main>
            <Footer locale={locale} />
        </div>
    );
}
