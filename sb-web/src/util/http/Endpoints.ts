import { Method } from 'axios';

interface Endpoint {
    method: Method;
    url: string;
}

type EndpointFunction = (...args: string[]) => Endpoint;

type AuthEndpointsLabels = 'Login' | 'Authorize' | 'Refresh' | 'Logout' | 'AcceptInvite';
export const AuthEndpoints: Record<AuthEndpointsLabels, EndpointFunction> = {
    Login: () => ({
        method: 'GET',
        url: 'api/auth/login',
    }),
    Authorize: () => ({
        method: 'GET',
        url: 'api/auth/authorize',
    }),
    Refresh: () => ({
        method: 'GET',
        url: 'api/auth/refresh',
    }),
    Logout: () => ({
        method: 'POST',
        url: 'api/auth/logout',
    }),
    AcceptInvite: (boatId: string, inviteId: string) => ({
        method: 'POST',
        url: `/api/boats/${boatId}/invites/${inviteId}/accept`,
    }),
};

type ProfileEndpointLabels = 'Me';
export const ProfileEndpoints: Record<ProfileEndpointLabels, Endpoint> = {
    Me: {
        method: 'GET',
        url: 'api/identity/me',
    },
};

type BoatEndpointLabels = 'Create' | 'Get';
export const BoatEndpoints: Record<BoatEndpointLabels, Endpoint> = {
    Get: {
        method: 'GET',
        url: 'api/boats',
    },
    Create: {
        method: 'POST',
        url: 'api/boats',
    },
};

type ImageEndpointLabels = 'Search';
export const ImageEndpoints: Record<ImageEndpointLabels, Endpoint> = {
    Search: {
        method: 'GET',
        url: 'api/images/search',
    },
};
