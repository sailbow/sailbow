import { Method } from 'axios';

interface Endpoint {
    method: Method;
    url: string;
}

export const AuthEndpoints: Record<string, Endpoint> = {
    Login: {
        method: 'GET',
        url: 'api/auth/login',
    },
    Authorize: {
        method: 'GET',
        url: 'api/auth/authorize',
    },
    Refresh: {
        method: 'GET',
        url: 'api/auth/refresh',
    },
};

export const ImageSearchEndpoints: Record<string, Endpoint> = {
    Search: {
        method: 'GET',
        url: 'https://api.pexels.com/v1/search',
    },
};
