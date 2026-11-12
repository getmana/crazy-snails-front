import { API_ERROR_CODES, type ApiErrorCode } from '@/constants';
import type { ErrorResponse } from '@/types';

export const getApiErrorMessage = (error: ErrorResponse, messages: Record<ApiErrorCode, string>): string => {
    if (error.code === API_ERROR_CODES.VALIDATION_FAILED) {
        return `${messages[API_ERROR_CODES.VALIDATION_FAILED]} ${error.message}`;
    }
    return messages[error.code];
};
