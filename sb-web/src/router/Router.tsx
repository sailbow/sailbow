import React, { FunctionComponent, lazy, Suspense } from 'react';

import { Switch, Route, Redirect as RouterRedirect } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { Footer } from 'modules/footer/Footer';
import { Navbar } from 'modules/navbar/Navbar';
import { BaseNavbar } from 'util/whitelisted/Base';
import { PrivateRoutes, Routes } from 'router/Router.Types';

import 'router/Router.scss';

/** Public Content */
const Landing = lazy(() => import('util/landing/Landing').then((module) => ({ default: module.Landing })));
const Authorize = lazy(() => import('auth/authorize/Authorize').then((module) => ({ default: module.Authorize })));
const Redirect = lazy(() => import('auth/redirect/Redirect').then((module) => ({ default: module.Redirect })));

/** Whitelisted Content */
const AboutUs = lazy(() => import('util/whitelisted/AboutUs').then((module) => ({ default: module.AboutUs })));
const HowItWorks = lazy(() => import('util/whitelisted/HowItWorks').then((module) => ({ default: module.HowItWorks })));
const FAQ = lazy(() => import('util/whitelisted/FAQ').then((module) => ({ default: module.FAQ })));
const Contact = lazy(() => import('util/whitelisted/Contact').then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import('util/whitelisted/Terms').then((module) => ({ default: module.Terms })));
const Privacy = lazy(() => import('util/whitelisted/Privacy').then((module) => ({ default: module.Privacy })));
const License = lazy(() => import('util/whitelisted/License').then((module) => ({ default: module.License })));
const NotFound = lazy(() => import('util/not-found/NotFound').then((module) => ({ default: module.NotFound })));

/** Private Content */
const Home = lazy(() => import('boats/home/Home').then((module) => ({ default: module.Home })));
const Create = lazy(() => import('boats/create/Create').then((module) => ({ default: module.Create })));
const Boat = lazy(() => import('boats/boat/Boat').then((module) => ({ default: module.Boat })));

export const WhitelistedRouter: FunctionComponent = () => {
    return (
        <>
            <BaseNavbar />
            <Box className="sb-whitelisted-router">
                <Suspense fallback={null}>
                    <Switch>
                        <Route path={Routes.Whitelisted.AboutUs}>
                            <AboutUs />
                        </Route>
                        <Route path={Routes.Whitelisted.HowItWorks}>
                            <HowItWorks />
                        </Route>
                        <Route path={Routes.Whitelisted.FAQ}>
                            <FAQ />
                        </Route>
                        <Route path={Routes.Whitelisted.Contact}>
                            <Contact />
                        </Route>
                        <Route path={Routes.Whitelisted.Privacy}>
                            <Privacy />
                        </Route>
                        <Route path={Routes.Whitelisted.Terms}>
                            <Terms />
                        </Route>
                        <Route path={Routes.Whitelisted.License}>
                            <License />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                </Suspense>
                <Footer />
            </Box>
        </>
    );
};

export const PublicRouter: FunctionComponent = () => {
    if (PrivateRoutes.includes(window.location.pathname)) {
        window.location.href = `${Routes.Public.Redirect}?path=${window.location.pathname}`;
    }

    return (
        <>
            <Navbar isAuth={false} />
            <Box className="sb-public-router">
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path={Routes.Public.Landing}>
                            <Landing />
                        </Route>
                        <Route path={Routes.Public.Login}>
                            <Authorize />
                        </Route>
                        <Route path={Routes.Public.Redirect}>
                            <Redirect />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                </Suspense>
                <Footer />
            </Box>
        </>
    );
};

export const PrivateRouter: FunctionComponent = () => {
    return (
        <>
            <Navbar isAuth />
            <Box className="sb-private-router">
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path="/">
                            <RouterRedirect to={Routes.Private.Home} />
                        </Route>
                        <Route path={Routes.Private.Home}>
                            <Home />
                        </Route>
                        <Route path={Routes.Private.Create}>
                            <Create />
                        </Route>
                        <Route path={`${Routes.Private.Boat}/:boatId`}>
                            <Boat />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                </Suspense>
            </Box>
        </>
    );
};
