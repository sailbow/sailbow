import { SbToken } from 'auth/Auth.Types';
import axios from 'axios';

export const LS = localStorage;

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
    AT_EXP = 'sb-at-exp',
    RT = 'sb-rt',
    RT_EXP = 'sb-rt-exp',
}

export const setAuthorizationHeaders = (accessToken: SbToken, refreshToken: SbToken): void => {
    LS.setItem(TokenStorageKeys.AT, accessToken.value);
    LS.setItem(TokenStorageKeys.AT_EXP, accessToken.expires);
    LS.setItem(TokenStorageKeys.RT, refreshToken.value);
    LS.setItem(TokenStorageKeys.RT_EXP, refreshToken.expires);
};

export const resetLocalStorage = (): void => {
    LS.clear();
};

export const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});
