import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions } from '@/lib';
import { ApiResponse, SignInResponse } from '@/types';

const query = `
    mutation ($input: SigninInput!) {
        signin(input: $input) {
            accessToken
            refreshToken
            userId
        }
    }
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('body', body);

        const variables = {
            input: body,
        };

        const fetchRes = await fetch(process.env.GRAPHQL_API as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });
        const result: ApiResponse = await fetchRes.json();
        if (!fetchRes.ok) {
            const errorMessage = result.errors[0].extensions.details.map(({ message }) => message).join('. ');
            return new Response(JSON.stringify({ message: errorMessage }), {
                status: fetchRes.status,
            });
        }
        console.log('sign in data ==> ', result.data);
        const {
            signin: { accessToken, refreshToken, userId },
        } = result.data as SignInResponse;

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
        session.user = { accessToken, id: userId };
        await session.save();

        const refreshTokenCookie = `refreshToken=${refreshToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; Path=/; Max-Age=2592000; SameSite=Strict`;

        return new Response(JSON.stringify({ message: 'Successfully signed in' }), {
            status: 200,
            headers: { 'Set-Cookie': refreshTokenCookie },
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
