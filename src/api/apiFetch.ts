import { FRONTEND_SECRET_HEADER } from '@/constants';

import 'server-only';

let hasWarnedMissingSecret = false;

const withFrontendSecret = (init?: HeadersInit): Headers => {
    const headers = new Headers(init);
    const secret = process.env.FRONTEND_API_SECRET;
    if (secret) {
        headers.set(FRONTEND_SECRET_HEADER, secret);
    } else if (!hasWarnedMissingSecret) {
        hasWarnedMissingSecret = true;
        console.warn('FRONTEND_API_SECRET is not set: API requests are rate-limited per IP.');
    }
    return headers;
};

export const apiFetch = (path: string, init: RequestInit = {}): Promise<Response> =>
    fetch(`${process.env.CS_API}${path}`, { ...init, headers: withFrontendSecret(init.headers) });
