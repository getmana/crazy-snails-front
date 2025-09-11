const signUpURL = 'http://localhost:3000/graphql';

type ErrorDetail = {
    validation: string;
    code: string;
    message: string;
    path: string[];
};

type Error = {
    message: string;
    locations: { line: number; column: number }[];
    path: string[];
    extensions: {
        code: string;
        details: ErrorDetail[];
    };
};

type apiResponse = {
    errors: Error[];
    data: unknown | null;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('body', body);
        const query = `
            mutation ($input: SignupInput!) {
                signup(input: $input) {
                    userId
                }
            }
        `;
        // Right query below
        // const query = `
        //     mutation signup($input: SignupInput!) {
        //         signup(input: $input) {
        //             userId
        //         }
        //     }
        // `;
        const variables = {
            input: body,
        };

        const fetchRes = await fetch(signUpURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });
        const result: apiResponse = await fetchRes.json();
        // console.log(
        //     'result===',
        //     result,
        //     'result.errors[0].locations',
        //     result.errors?.[0].locations,
        //     'result.errors[0].path',
        //     result.errors?.[0].path,
        //     'response.status',
        //     fetchRes.status,
        //     'response.ok',
        //     fetchRes.ok,
        // );
        if (!fetchRes.ok) {
            const errorMessage = result.errors[0].extensions.details.map(({ message }) => message).join('. ');
            return new Response(JSON.stringify({ message: errorMessage }), {
                status: fetchRes.status,
            });
        }

        return new Response(JSON.stringify({ message: 'Account is created', data: result.data }), {
            status: 200,
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
