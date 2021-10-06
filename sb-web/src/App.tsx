import React, { FunctionComponent } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ToastBar, ToastProvider } from 'common/toast/Toast';
import { PublicContent } from 'screens/content/Content';

import './App.scss';

export const App: FunctionComponent = () => {
    return (
        <>
            <ToastProvider>
                <ToastBar />
                <BrowserRouter>
                    <PublicContent />
                </BrowserRouter>
            </ToastProvider>
        </>
    );
};
