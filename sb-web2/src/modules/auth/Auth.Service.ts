import { AxiosResponse } from 'axios';
import { Routes } from 'router/Router.Types';

import { EndpointFunction } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export enum Provider {
    Google = "google",
    Facebook = "facebook"
}

export const ProviderToUriMapper: Record<string, string> = {
    [Provider.Google]: `${window.location.origin}${Routes.Public.Login}?provider=${Provider.Google}`,
    [Provider.Facebook]: `${window.location.origin}${Routes.Public.Login}?provider=${Provider.Facebook}`,
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
