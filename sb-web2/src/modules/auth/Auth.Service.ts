import { AxiosResponse } from 'axios';

import { EndpointFunction } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export enum Provider {
    Google,
    Facebook,
}

export const ProviderToUriMapper: Record<string, string> = {
    [Provider.Google]: `${process.env.REACT_APP_GOOGLE_REDIRECT_URI!}`,
    [Provider.Facebook]: `${process.env.REACT_APP_GOOGLE_REDIRECT_URI!}`,
};

export interface RedirectResponse {
    accessToken: {
        value: string;
    };
    refreshToken: {
        value: string;
    };
}

type AuthEndpointsLabels = 'ProviderLogin' | 'Authorize' | 'Refresh' | 'Logout';
export const AuthEndpoints: Record<AuthEndpointsLabels, EndpointFunction> = {
    ProviderLogin: () => ({
        method: 'GET',
        url: 'api/auth/login',
    }),
    Authorize: () => ({
        method: 'GET',
        url: 'api/auth/authorize',
    }),
    Refresh: () => ({
        method: 'POST',
        url: 'api/auth/refresh',
    }),
    Logout: () => ({
        method: 'POST',
        url: 'api/auth/logout',
    }),
};

export const providerLogin = async (provider: Provider, state: string): Promise<string> => {
    console.log(encodeURI(ProviderToUriMapper[provider]));
    const { data }: AxiosResponse<string> = await Http({
        ...AuthEndpoints.ProviderLogin(),
        params: {
            provider,
            state,
            redirectUri: encodeURI(ProviderToUriMapper[provider]),
        },
    });

    return data;
};

export const authorize = async (provider: Provider, code: string): Promise<RedirectResponse> => {
    const { data }: AxiosResponse<RedirectResponse> = await Http({
        ...AuthEndpoints.Authorize(),
        params: {
            provider,
            code,
            redirectUri: encodeURI(ProviderToUriMapper[provider]),
        },
    });

    return data;
};
