import type { Locale } from '@/i18n-config';

type ErrorDetail = {
    validation: string;
    code: string;
    message: string;
    path: string[];
};

type ErrorItem = {
    message: string;
    locations: { line: number; column: number }[];
    path: string[];
    extensions: {
        code: string;
        details: ErrorDetail[];
    };
};

export type ApiResponse = {
    errors: ErrorItem[];
    data: unknown | null;
};

export type SignInResponse = {
    accessToken: string;
    refreshToken: string;
    id: string;
    locale: Locale;
};

export type ErrorResponse = {
    message: string;
    error: string;
    statusCode: number;
};
