import React, { FunctionComponent, useEffect } from 'react';

import { Flex, Heading } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';

import { ToastActionType, useToast } from 'modules/toast/Toast';
import { Routes } from 'router/Router.Types';
import { Http, RedirectResponse, setHeadersToLocalStorage } from 'util/http/Http';
import { AuthEndpoints } from 'util/http/Endpoints';
import { ProviderToUriMapper } from 'auth/AuthCard';

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
                    const { data }: AxiosResponse<RedirectResponse> = await Http({
                        ...AuthEndpoints.Authorize,
                        params: {
                            provider,
                            code,
                            redirectUri: ProviderToUriMapper[provider],
                        },
                    });

                    setHeadersToLocalStorage(data.accessToken, data.expiresAt);
                    window.location.href = Routes.Private.Home;
                } else {
                    throw new Error('Could not login. Invalid redirect parameters.');
                }
            } catch (err) {
                dispatch({ type: ToastActionType.ShowError, text: (err as Error).message });
                history.push(Routes.Public.Landing);
            }
        })();
    });

    return (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <Heading fontWeight="semibold">Redirecting...</Heading>
        </Flex>
    );
};
