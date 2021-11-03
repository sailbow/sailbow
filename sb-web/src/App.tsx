import React, { FunctionComponent, useEffect, useState } from 'react';

import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'boats/Boat';
import { ToastBar, ToastProvider } from 'modules/toast/Toast';
import { PrivateContent, PublicContent, WhitelistedContent } from 'screens/content/Content';
import { LS, TokenStorageKeys } from 'util/Http';
import { HttpInterceptor } from 'util/HttpInterceptor';
import { WhitelistedRoutes } from 'util/Routing';

import './App.scss';
import { ProfileProvider, useProfile } from 'modules/profile/Profile';
import { ProfileLoading } from 'modules/profile/profile-loading/ProfileLoading';

const AppContainer: FunctionComponent = () => {
    const [profileContainer] = useProfile();

    return <>{profileContainer.loading ? <></> : <PrivateContent />}</>;
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
            <BoatProvider>
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
            </BoatProvider>
        </ToastProvider>
    ) : (
        <></>
    );
};
