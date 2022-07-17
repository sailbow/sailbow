import React, { FunctionComponent, useEffect, useState } from 'react';

import { ApolloProvider } from '@apollo/client';
import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'modules/boats/Boat.Store';
import { ProfileProvider, useProfile } from 'profile/Profile';
import { ProfileLoading } from 'profile/profile-loading/ProfileLoading';
import { ToastBar, ToastProvider } from 'modules/toast/Toast';
import { PrivateRouter, PublicRouter, WhitelistedRouter } from 'router/Router';
import { WhitelistedRoutes } from 'router/Router.Types';
import { LS, TokenStorageKeys } from 'util/http/Http';
import { HttpInterceptor } from 'util/http/HttpInterceptor';
import { GqlClient } from 'util/gql/Gql';

import './App.scss';
import { GqlInterceptor } from 'util/gql/GqlInterceptor';

const AppContainer: FunctionComponent = () => {
    const [{ loading }] = useProfile();

    return (
        <>
            {loading ? (
                <></>
            ) : (
                <BoatProvider>
                    <PrivateRouter />
                </BoatProvider>
            )}
        </>
    );
};

export const App: FunctionComponent = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        Aos.init();
    }, []);

    useEffect(() => {
        if (LS.getItem(TokenStorageKeys.AT)) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
        setMounted(true);

        return () => {
            setIsAuth(false);
            setMounted(false);
        };
    }, [window.location.pathname]); // eslint-disable-line

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

    return mounted ? (
        <ApolloProvider client={GqlClient}>
            <ToastProvider>
                <ToastBar />
                <HttpInterceptor />
                <GqlInterceptor />
                <BrowserRouter>
                    {isAuth ? (
                        <ProfileProvider>
                            <ProfileLoading />
                            <AppContainer />
                        </ProfileProvider>
                    ) : (
                        <PublicRouter />
                    )}
                </BrowserRouter>
            </ToastProvider>
        </ApolloProvider>
    ) : (
        <></>
    );
};
