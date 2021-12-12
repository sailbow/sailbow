import { AxiosResponse } from 'axios';

import { BannerState, Boat } from 'boats/Boat.Types';
import { AuthEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export interface InviteType {
    id: string;
    banner: BannerState;
    boatName: string;
    captain: {
        name: string;
        role: string;
        userId: string;
    };
}

export const getInvite = async (boatId: string, inviteId: string): Promise<InviteType> => {
    const { data }: AxiosResponse<InviteType> = await Http(AuthEndpoints.GetInvite(boatId, inviteId));

    return data;
};

export const acceptInvite = async (boatId: string, inviteId: string): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http(AuthEndpoints.AcceptInvite(boatId, inviteId));

    return data;
};
