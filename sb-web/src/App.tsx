import React, { FunctionComponent } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ToastBar, ToastProvider } from 'common/toast/Toast';
import { PublicContent, WhitelistedContent } from 'screens/content/Content';

import './App.scss';
import { WhitelistedRoutes } from 'util/Routing';
import { BoatProvider } from 'common/boat/Boat';

export const App: FunctionComponent = () => {
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
