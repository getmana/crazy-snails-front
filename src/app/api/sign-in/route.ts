import { ApiResponse } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('body', body);

        const query = `
            mutation ($input: SigninInput!) {
                signin(input: $input) {
                    accessToken
                    refreshToken
                }
            }
        `;

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
        return new Response(JSON.stringify({ message: 'Successfully signed in', data: result.data }), {
            status: 200,
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
