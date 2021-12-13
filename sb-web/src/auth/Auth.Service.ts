import { AxiosResponse } from 'axios';

import { AuthEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export enum Provider {
    Google,
    Facebook,
}

export const ProviderToUriMapper: Record<string, string> = {
    [Provider.Google]: process.env.REACT_APP_GOOGLE_REDIRECT_URI!,
    [Provider.Facebook]: process.env.REACT_APP_FACEBOOK_REDIRECT_URI!,
};

export interface RedirectResponse {
    accessToken: string;
    expiresAt: string;
}

export const login = async (provider: Provider, state: string): Promise<string> => {
    const { data }: AxiosResponse<string> = await Http({
        ...AuthEndpoints.Login(),
        params: {
            provider,
            state,
            redirectUri: encodeURI(ProviderToUriMapper[provider]),
        },
    });
    return data;
};

export const authorize = async (provider: string, code: string): Promise<RedirectResponse> => {
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
