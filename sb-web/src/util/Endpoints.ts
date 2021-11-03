import { Method } from 'axios';

interface Endpoint {
    method: Method;
    url: string;
}

type AuthEndpointsLabels = 'Login' | 'Authorize' | 'Refresh';
export const AuthEndpoints: Record<AuthEndpointsLabels, Endpoint> = {
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

type ProfileEndpointLabels = 'Me';
export const ProfileEndpoints: Record<ProfileEndpointLabels, Endpoint> = {
    Me: {
        method: 'GET',
        url: 'api/identity/me',
    },
};

export const ImageSearchEndpoints: Record<string, Endpoint> = {
    Search: {
        method: 'GET',
        url: 'https://api.pexels.com/v1/search',
    },
};
