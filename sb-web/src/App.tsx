import React, { FunctionComponent, useEffect, useState } from 'react';

import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'boats/Boat.Store';
import { ProfileProvider, useProfile } from 'profile/Profile';
import { ProfileLoading } from 'profile/profile-loading/ProfileLoading';
import { ToastBar, ToastProvider } from 'modules/toast/Toast';
import { PrivateContent, PublicContent, WhitelistedContent } from 'screens/content/Content';
import { LS, TokenStorageKeys } from 'util/Http';
import { HttpInterceptor } from 'util/HttpInterceptor';
import { WhitelistedRoutes } from 'util/Routing';

import './App.scss';

const AppContainer: FunctionComponent = () => {
    const [profileContainer] = useProfile();

    return (
        <>
            {profileContainer.loading ? (
                <></>
            ) : (
                <BoatProvider>
                    <PrivateContent />
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
                        <WhitelistedContent />
                    </BrowserRouter>
                </ToastProvider>
            </>
        );
    }

    return mounted ? (
        <ToastProvider>
            <ToastBar />
            <HttpInterceptor />
            <BrowserRouter>
                {isAuth ? (
                    <ProfileProvider>
                        <ProfileLoading />
                        <AppContainer />
                    </ProfileProvider>
                ) : (
                    <PublicContent />
                )}
            </BrowserRouter>
        </ToastProvider>
    ) : (
        <></>
    );
};
