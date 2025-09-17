import { SessionOptions } from 'iron-session';

export interface SessionData {
    user: {
        accessToken: string;
        id: string;
    };
}

console.log('process.env.SESSION_SECRET', process.env.SESSION_SECRET);

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};
