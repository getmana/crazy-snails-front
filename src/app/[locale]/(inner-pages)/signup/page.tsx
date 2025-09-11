import Link from 'next/link';

import { Heading, SignUpForm } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function SignUp(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle, text, link } = await getDictionary(locale);

    return (
        <div className="section flex w-full flex-col items-center px-8">
            <Heading heading={title.signup} className="heading-3" headingTag="h1" subheading={subtitle.signup} />
            <div className="w-full bg-white py-12 md:w-2xl">
                <SignUpForm />
                <div className="text-center">
                    <span className="">{text.haveAccunt}&nbsp;</span>
                    <Link href={`/${locale}/signin`} className="font-semibold underline">
                        {link.signin}
                    </Link>
                </div>
            </div>
        </div>
    );
}
