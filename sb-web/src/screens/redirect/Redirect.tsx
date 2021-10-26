import React, { FunctionComponent, useEffect } from 'react';

import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';

import { ToastActionType, useToast } from 'contexts/toast/Toast';
import { Routes } from 'util/Routing';
import { Http, RedirectResponse, setHeadersToLocalStorage } from 'util/Http';
import { AuthEndpoints } from 'util/Endpoints';
import { Providers, ProviderToUriMapper } from 'modules/auth/AuthCard';

export const Redirect: FunctionComponent = () => {
    const history = useHistory();
    const [, dispatch] = useToast();

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const code: string | null = urlSearchParams.get('code');
            const provider: string | null = urlSearchParams.get('provider');

            try {
                if (code && provider) {
                    const { data } = await Http({
                        method: AuthEndpoints.Authorize.method,
                        url: AuthEndpoints.Authorize.url,
                        params: {
                            provider,
                            code,
                            redirectUri: ProviderToUriMapper[provider],
                        },
                    });

                    await setHeadersToLocalStorage(
                        data.tokens.access_token,
                        data.tokens.refresh_token,
                        data.tokens.expires_in,
                        data.tokens.token_type,
                    );
                } else {
                    throw new Error('Could not login. Invalid redirect parameters.');
                }
            } catch (err) {
                dispatch({ type: ToastActionType.ShowError, text: (err as Error).message });
                history.push(Routes.Public.Landing);
            }
        })();
    });

    return <span>Redirecting...</span>;
};
