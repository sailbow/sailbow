import React, { FunctionComponent, useEffect, useState } from 'react';

import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'contexts/boat/Boat';
import { ToastBar, ToastProvider } from 'contexts/toast/Toast';
import { PrivateContent, PublicContent, WhitelistedContent } from 'screens/content/Content';
import { LS, TokenStorageKeys } from 'util/Http';
import { HttpInterceptor } from 'util/HttpInterceptor';
import { WhitelistedRoutes } from 'util/Routing';

import './App.scss';

const AppContainer: FunctionComponent = () => {
    // const [profileContainer] = useProfile();
    const profileContainer = {
        loading: false,
    };

    return <>{profileContainer.loading ? <span>Initializing..</span> : <PrivateContent />}</>;
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
                {/* <HttpInterceptor /> */}
                <BrowserRouter>
                    {isAuth ? (
                        // <ProfileProvider>
                        <AppContainer />
                    ) : (
                        // </ProfileProvider>
                        <PublicContent />
                    )}
                </BrowserRouter>
            </BoatProvider>
        </ToastProvider>
    ) : (
        <></>
    );
};
