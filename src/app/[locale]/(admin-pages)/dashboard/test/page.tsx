import { getIronSession } from 'iron-session';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

import { Heading } from '@/components';
import { Locale } from '@/i18n-config';
import { SessionData, sessionOptions } from '@/lib';

export default async function Test(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;
    const cookieStore = await cookies();
    const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

    console.log('test page session user ==>', user);

    return (
        <div className="section flex w-full flex-col items-center px-8">
            <Heading heading="TEST PAGE" className="heading-3" headingTag="h1" />
        </div>
    );
}
