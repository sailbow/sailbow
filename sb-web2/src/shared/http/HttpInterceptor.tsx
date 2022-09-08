import React, { FunctionComponent, useEffect } from 'react';

import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { AuthEndpoints, RedirectResponse } from 'modules/auth/Auth.Service';
import { showErrorToast } from 'shared/toast/Toast';
import { Http, HttpStatus, setHeadersToLocalStorage, resetLocalStorage } from 'shared/http/Http';
import { Routes } from 'router/Router.Types';
import { LocalStorageKeys, LS } from 'util/localstorage/LocalStorage';

interface A2 extends AxiosRequestConfig {
    retry?: boolean;
}

export const HttpInterceptor: FunctionComponent = () => {
    useEffect(() => {
        Http.interceptors.request.use(
            (value: AxiosRequestConfig) => {
                const request = { ...value };
                request.headers = {
                    Authorization: `Bearer ${LS.getItem(LocalStorageKeys.AT) || ''}`,
                };
                return request;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            },
        );

        Http.interceptors.response.use(
            (value: AxiosResponse): AxiosResponse<any> | Promise<AxiosResponse<any>> => {
                return value;
            },
            (error: AxiosError): Promise<any> => {
                const originalRequest: A2 = {
                    ...error.config,
                };

                switch (error.response?.status) {
                    case HttpStatus.UNAUTHORIZED:
                        if (originalRequest.url?.includes(AuthEndpoints.Refresh().url)) {
                            console.log('Should go to login page');
                            resetLocalStorage();
                            window.location.href = Routes.Public.Landing;
                            showErrorToast("Unauthorized! Looks like you aren't on the manifest");
                        } else if (!originalRequest.retry) {
                            originalRequest.retry = true;
                            console.log('Refreshing token....');

                            const response = Http(AuthEndpoints.Refresh()).then(
                                async ({ data }: AxiosResponse<RedirectResponse>) => {
                                    const { accessToken, expiredAt } = data;
                                    setHeadersToLocalStorage(accessToken, expiredAt);
                                    originalRequest.headers = {
                                        Authorization: `Bearer ${LS.getItem(LocalStorageKeys.AT) || ''}`,
                                    };

                                    console.log('Token refreshed...');

                                    return Http.request(originalRequest);
                                },
                            );
                            return Promise.resolve(response);
                        }
                        break;
                    default:
                        showErrorToast('Oops! Something went wrong... :(');
                        break;
                }
                return Promise.reject(error);
            },
        );
    }, []); // eslint-disable-line
    return <></>;
};
