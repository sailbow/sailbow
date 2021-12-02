import { AxiosResponse } from 'axios';
import { Profile } from 'profile/Profile.Types';
import { ProfileEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export const getProfile = async (): Promise<Profile> => {
    const { data }: AxiosResponse<Profile> = await Http(ProfileEndpoints.Me);

    return data;
};
