import { AxiosResponse } from 'axios';

import { Http } from 'util/http/Http';
import { EndpointFunction } from 'util/http/Endpoints';

type UserEndpointLabels = 'Me' | 'Update' | 'UpdatePassword' | 'Search';

export const ProfileEndpoints: Record<UserEndpointLabels, EndpointFunction> = {
    Me: () => ({
        method: 'GET',
        url: 'api/identity/me',
    }),
    Search: <T>(q: T) => ({
        method: 'GET',
        url: '/api/users/search',
        params: {
            q,
        },
    }),
    Update: <T>(data: T) => ({
        method: 'PUT',
        url: '/users/me',
        data,
    }),
    UpdatePassword: <T>(data: T) => ({
        method: 'PUT',
        url: '/users/me/password',
        data,
    }),
};

export interface User {
    dateCreated: string;
    email: string;
    id: string;
    name: string;
    provider: string;
    providerUserId: string;
}

// export type UserSignUpType = Pick<
//     User,
//     'firstName' | 'lastName' | 'password' | 'email' | 'phoneNumber' | 'accountType'
// >;

// export type UserSignInType = Pick<User, 'email' | 'password'>;

// export type ResetPasswordType = {
//     password: string;
//     hash: string;
// };

// export interface BasicInfoFormState {
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
//     avatarUrl?: File | string;
// }

// export interface UpdatePasswordFormState {
//     newPassword: string;
//     oldPassword: string;
//     newPassword2: string;
// }

// type UpdatePasswordPayload = Pick<UpdatePasswordFormState, 'oldPassword' | 'newPassword'>;

export const getUser = async (): Promise<User> => {
    const { data }: AxiosResponse<User> = await Http(ProfileEndpoints.Me());

    return data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
    const { data }: AxiosResponse<any> = await Http(ProfileEndpoints.Search(query));
    
    return data;
};

// export const updateUser = async (updatedData: BasicInfoFormState) => {
//     const { data }: AxiosResponse<User> = await Http(ProfileEndpoints.Update<BasicInfoFormState>(updatedData));

//     return data;
// };

// export const updatePassword = async (updatedPassword: UpdatePasswordPayload) => {
//     const { data }: AxiosResponse<void> = await Http(
//         ProfileEndpoints.UpdatePassword<UpdatePasswordPayload>(updatedPassword)
//     );

//     return data;
// };
