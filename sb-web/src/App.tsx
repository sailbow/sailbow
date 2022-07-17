import React, { FunctionComponent, useEffect, useState } from 'react';

import { ApolloProvider } from '@apollo/client';
import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'modules/boats/Boat.Store';
import { Authenticator, AuthStoreProvider } from 'modules/auth/Auth.Store';
import { ToastBar, ToastProvider } from 'shared/toast/Toast';
import { PrivateRouter, PublicRouter, WhitelistedRouter } from 'router/Router';
import { WhitelistedRoutes } from 'router/Router.Types';
import { HttpInterceptor } from 'util/http/HttpInterceptor';
import { GqlClient } from 'util/gql/Gql';
import { GqlInterceptor } from 'util/gql/GqlInterceptor';

import './App.scss';

export const App: FunctionComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        Aos.init();
    }, []);

    if (WhitelistedRoutes.includes(window.location.pathname)) {
        return (
            <>
                <ToastProvider>
                    <ToastBar />
                    <BrowserRouter>
                        <WhitelistedRouter />
                    </BrowserRouter>
                </ToastProvider>
            </>
        );
    }

    return (
        <ApolloProvider client={GqlClient}>
            <ToastProvider>
                <BrowserRouter>
                    <AuthStoreProvider>
                        <GqlInterceptor />
                        <ToastBar />
                        <HttpInterceptor />
                        <Authenticator onAuthLoadingChange={setLoading} onLoggedInChange={setIsLoggedIn}>
                            {!loading ? (
                                <>
                                    {isLoggedIn ? (
                                        <BoatProvider>
                                            <PrivateRouter />
                                        </BoatProvider>
                                    ) : (
                                        <PublicRouter />
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </Authenticator>
                    </AuthStoreProvider>
                    {/* {isAuth ? (
                        <ProfileProvider>
                            <ProfileLoading />
                            <AppContainer />
                        </ProfileProvider>
                    ) : (
                        <PublicRouter />
                    )} */}
                </BrowserRouter>
            </ToastProvider>
        </ApolloProvider>
    );
};
