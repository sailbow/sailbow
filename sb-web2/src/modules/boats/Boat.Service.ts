import { AxiosResponse } from 'axios';

import { Boat, CreateBoat, CrewMember, Photo } from 'modules/boats/Boat.Types';
import { Http } from 'util/http/Http';
import { EndpointFunction } from 'util/http/Endpoints';

type BoatEndpointLabels = 'Create' | 'GetAll' | 'Get' | 'GetCrew';
export const BoatEndpoints: Record<BoatEndpointLabels, EndpointFunction> = {
    GetAll: () => ({
        method: 'GET',
        url: 'api/boats',
    }),
    Create: () => ({
        method: 'POST',
        url: 'api/boats',
    }),
    Get: (boatId) => ({
        method: 'GET',
        url: `api/boats/${boatId}`,
    }),
    GetCrew: (boatId) => ({
        method: 'GET',
        url: `api/boats/${boatId}/crew`,
    }),
};

type ImageEndpointLabels = 'Search';
export const ImageEndpoints: Record<ImageEndpointLabels, EndpointFunction> = {
    Search: () => ({
        method: 'GET',
        url: 'api/images/search',
    }),
};

// GetInvite: <T>(data: T) => ({
//     method: 'GET',
//     url: `api/boats/${data.boatId}/invites/${data.inviteId}`,
// }),
// AcceptInvite: (boatId: string, inviteId: string) => ({
//     method: 'POST',
//     url: `/api/boats/${boatId}/invites/${inviteId}/accept`,
// }),

export const getBannerImages = async (value: string, newPage: number): Promise<Photo[]> => {
    const { data }: AxiosResponse = await Http({
        ...ImageEndpoints.Search,
        params: {
            query: value,
            page: newPage,
        },
    });
    const photos: Photo[] = [];

    data.forEach((photo: any) => {
        photos.push({
            src: photo.url,
            width: 3,
            height: 2,
        });
    });

    return photos;
};

export const createBoat = async (boat: CreateBoat): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        ...BoatEndpoints.Create(),
        data: { ...boat },
    });

    return data;
};

export const getBoat = async (boatId: string): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http(BoatEndpoints.Get(boatId));

    return data;
};

export const getAllBoats = async (): Promise<Boat[]> => {
    const { data }: AxiosResponse<Boat[]> = await Http(BoatEndpoints.GetAll());

    return data;
};

export const getCrew = async (boatId: string): Promise<CrewMember[]> => {
    const { data }: AxiosResponse<CrewMember[]> = await Http(BoatEndpoints.GetCrew(boatId));

    return data;
};
