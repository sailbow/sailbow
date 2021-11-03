import axios from 'axios';

export const LS = localStorage;

export interface RedirectResponse {
    accessToken: string;
    expiresAt: string;
}

export enum HttpStatus {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

export enum TokenStorageKeys {
    AT = 'sb-at',
    EXP = 'sb-exp',
}

export const buildHeaders = (): any => ({
    [TokenStorageKeys.AT]: LS.getItem(TokenStorageKeys.AT) || '',
    [TokenStorageKeys.EXP]: LS.getItem(TokenStorageKeys.EXP) || '',
});

export const setHeadersToLocalStorage = (accessToken: string, exp: string): void => {
    LS.setItem(TokenStorageKeys.AT, accessToken);
    LS.setItem(TokenStorageKeys.EXP, exp);
};

export const resetLocalStorage = (): void => {
    LS.removeItem(TokenStorageKeys.AT);
    LS.removeItem(TokenStorageKeys.EXP);
};

export const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});
