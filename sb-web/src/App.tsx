import React, { FunctionComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { PublicContent } from 'screens/content/Content';

import './App.scss';

export const App: FunctionComponent = () => {
    return (
        <>
            <BrowserRouter>
                <PublicContent />
            </BrowserRouter>
        </>
    );
};
