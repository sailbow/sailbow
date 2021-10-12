import React, { FunctionComponent, useEffect } from 'react';

import Aos from 'aos';
import { BrowserRouter } from 'react-router-dom';

import { BoatProvider } from 'contexts/boat/Boat';
import { ToastBar, ToastProvider } from 'contexts/toast/Toast';
import { PublicContent, WhitelistedContent } from 'screens/content/Content';
import { WhitelistedRoutes } from 'util/Routing';

import './App.scss';

export const App: FunctionComponent = () => {
    useEffect(() => {
        Aos.init();
    }, []);

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

    return (
        <>
            <ToastProvider>
                <BoatProvider>
                    <ToastBar />
                    <BrowserRouter>
                        <PublicContent />
                    </BrowserRouter>
                </BoatProvider>
            </ToastProvider>
        </>
    );
};
