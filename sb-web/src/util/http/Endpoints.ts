import { Method } from 'axios';

interface Endpoint {
    method: Method;
    url: string;
}

export type EndpointFunction = <T>(args?: T) => Endpoint;

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
