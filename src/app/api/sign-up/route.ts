import { ErrorResponse } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(`${process.env.CS_API}/users` as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();
        console.log('sign-up response ==>', responseData);

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }

        return new Response(JSON.stringify({ message: 'Account is created', data: responseData }), {
            status: 200,
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
