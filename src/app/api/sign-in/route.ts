import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions } from '@/lib';
import { ErrorResponse, SignInResponse } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('body', body);

        const response = await fetch(`${process.env.CS_API}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }
        console.log('sign in data ==> ', responseData);

        const { accessToken, id } = responseData as SignInResponse;

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
        session.user = { accessToken, id };
        await session.save();

        // const refreshTokenCookie = `refreshToken=${refreshToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; Path=/; Max-Age=2592000; SameSite=Strict`;

        return new Response(JSON.stringify({ message: 'Successfully signed in' }), {
            status: 200,
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
