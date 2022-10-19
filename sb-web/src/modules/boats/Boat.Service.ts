import { gql } from '@apollo/client';
import { AxiosResponse } from 'axios';

import { Boat, CreateBoat, Crew, Photo } from 'modules/boats/Boat.Types';
import { GqlClient } from 'util/gql/Gql';
import { BoatEndpoints, ImageEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

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

export const createBoatService = async (boat: CreateBoat): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        ...BoatEndpoints.Create,
        data: { ...boat },
    });

    return data;
};

export const getBoatService = async (boatId: string): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        method: BoatEndpoints.Get.method,
        url: `${BoatEndpoints.Get.url}/${boatId}`,
    });

    return data;
};

export const getAllBoatsService = async (): Promise<Boat[]> => {
    const { data }: AxiosResponse<Boat[]> = await Http(BoatEndpoints.Get);

    return data;
};

export const getUsersByQuery = async (query: string): Promise<Crew[]> => {
    const { data } = await GqlClient.query<{ users: Crew[] }>({
        query: gql`
            query GetUsers($q: String!) {
                users(where: { or: [{ email: { contains: $q } }, { name: { contains: $q } }] }) {
                    id
                    name
                    email
                }
            }
        `,
        variables: { q: query },
    });

    return data.users;
};
