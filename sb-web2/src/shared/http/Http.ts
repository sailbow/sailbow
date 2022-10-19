import axios from 'axios';

import { LocalStorageKeys } from 'util/localstorage/LocalStorage';

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

export const setHeadersToLocalStorage = (accessToken: string, expiresAt: string): void => {
    LS.setItem(LocalStorageKeys.AT, accessToken);
    LS.setItem(LocalStorageKeys.EXP, expiresAt);
};

export const resetLocalStorage = (): void => {
    LS.clear();
};

export const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});
