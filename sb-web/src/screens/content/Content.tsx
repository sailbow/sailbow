import React, { FunctionComponent, lazy, Suspense } from 'react';
import { Switch, Route, Redirect as RouterRedirect } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { Footer } from 'modules/footer/Footer';
import { Navbar } from 'modules/navbar/Navbar';
import { BaseNavbar } from 'screens/whitelisted/Base';
import { Routes } from 'util/Routing';

import 'screens/content/Content.scss';

const Landing = lazy(() => import('screens/landing/Landing').then((module) => ({ default: module.Landing })));
const AboutUs = lazy(() => import('screens/whitelisted/AboutUs').then((module) => ({ default: module.AboutUs })));

export const WhitelistedContent: FunctionComponent = () => {
    return (
        <>
            <BaseNavbar />
            <Box className="sb-whitelisted-content">
                <Suspense fallback={null}>
                    <Switch>
                        <Route path={Routes.Whitelisted.AboutUs}>
                            <AboutUs />
                        </Route>
                    </Switch>
                </Suspense>
            </Box>
        </>
    );
};

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
                <Footer />
            </Box>
        </>
    );
};
