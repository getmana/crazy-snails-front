import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { middlewares } from '@/middlewares';

export const middleware = async (request: NextRequest) => {
    let response = NextResponse.next();

    for (const middlewareFunction of middlewares) {
        if (!middlewareFunction.match || new RegExp(middlewareFunction.match).test(request.nextUrl.pathname)) {
            response = await middlewareFunction.run(request, response);
        }
    }

    return response;
};
