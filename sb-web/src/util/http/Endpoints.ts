import { Method } from 'axios';

interface Endpoint {
    method: Method;
    url: string;
}

type AuthEndpointsLabels = 'Login' | 'Authorize' | 'Refresh' | 'Logout';
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
    Logout: {
        method: 'POST',
        url: 'api/auth/logout',
    },
};

type ProfileEndpointLabels = 'Me';
export const ProfileEndpoints: Record<ProfileEndpointLabels, Endpoint> = {
    Me: {
        method: 'GET',
        url: 'api/identity/me',
    },
};

type BoatEndpointLabels = 'Create';
export const BoatEndpoints: Record<BoatEndpointLabels, Endpoint> = {
    Create: {
        method: 'POST',
        url: 'api/boats/create',
    },
};

export const ImageSearchEndpoints: Record<string, Endpoint> = {
    Search: {
        method: 'GET',
        url: 'https://api.pexels.com/v1/search',
    },
};
