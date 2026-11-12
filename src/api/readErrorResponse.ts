import { API_ERROR_CODES, type ApiErrorCode, HTTP_STATUS } from '@/constants';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

type ErrorResponseBody = Omit<ErrorResponse, 'code'> & { code: string };

const KNOWN_CODES: readonly string[] = Object.values(API_ERROR_CODES);

const isErrorResponseBody = (value: unknown): value is ErrorResponseBody =>
    !!value &&
    typeof value === 'object' &&
    typeof (value as ErrorResponseBody).statusCode === 'number' &&
    typeof (value as ErrorResponseBody).code === 'string' &&
    typeof (value as ErrorResponseBody).message === 'string';

const isApiErrorCode = (code: string): code is ApiErrorCode => KNOWN_CODES.includes(code);

export const readErrorResponse = async (response: Response): Promise<ErrorResponse> => {
    const body: unknown = await response.json().catch(() => null);
    if (!isErrorResponseBody(body)) {
        return { statusCode: response.status, code: API_ERROR_CODES.UNEXPECTED_ERROR, message: response.statusText };
    }
    if (!isApiErrorCode(body.code)) {
        console.error(`Unknown API error code "${body.code}": sync API_ERROR_CODES with cs-nest PUBLIC_ERROR_CODES`);
        return { ...body, code: API_ERROR_CODES.UNEXPECTED_ERROR };
    }

    const { statusCode, code, message } = body;

    return { statusCode, code, message };
};

export const toUnexpectedError = (e: unknown): ErrorResponse => ({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: API_ERROR_CODES.UNEXPECTED_ERROR,
    message: getErrorMessage(e),
});

export const toUnauthorizedError = (message = 'No active session'): ErrorResponse => ({
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    code: API_ERROR_CODES.UNAUTHORIZED,
    message,
});
