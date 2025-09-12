import { Heading, SignInForm } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function SignIn(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title, subtitle } = await getDictionary(locale);

    return (
        <div className="section flex w-full flex-col items-center px-8">
            <Heading heading={title.signin} className="heading-3" headingTag="h1" subheading={subtitle.signin} />
            <div className="w-full bg-white py-12 md:w-2xl">
                <SignInForm />
            </div>
        </div>
    );
}
