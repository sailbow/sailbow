import React, { FunctionComponent, lazy, Suspense } from 'react';
import { Switch, Route, Redirect as RouterRedirect } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { Routes } from 'util/Routing';
import { Navbar } from 'modules/navbar/Navbar';

import 'screens/content/Content.scss';

const Landing = lazy(() => import('screens/landing/Landing').then((module) => ({ default: module.Landing })));

export const PublicContent: FunctionComponent = () => {
    return (
        <>
            <Navbar isAuth={false} />
            <Box className="sb-public-content">
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path={Routes.Public.Landing}>
                            <Landing />
                        </Route>
                        <Route path="*">
                            <RouterRedirect to={Routes.Public.Landing} />
                        </Route>
                    </Switch>
                </Suspense>
            </Box>
        </>
    );
};
