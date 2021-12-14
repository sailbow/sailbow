import React, { FunctionComponent, lazy, Suspense, useEffect } from 'react';

import { Switch, Route, Redirect as RouterRedirect, matchPath } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { CreateEdit } from 'boats/create-edit/CreateEdit';
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
const Boat = lazy(() => import('boats/Boat').then((module) => ({ default: module.Boat })));
const Invite = lazy(() => import('auth/invite/Invite').then((module) => ({ default: module.Invite })));
const Error = lazy(() => import('util/error/Error').then((module) => ({ default: module.Error })));

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
    // this is a hacky way. need to use regex to optimize route matching
    useEffect(() => {
        // eslint-disable-next-line
        for (const path of PrivateRoutes) {
            const { search, pathname } = window.location;
            const match = matchPath(pathname, { path, strict: true, exact: true });
            if (match) {
                window.location.href = `${Routes.Public.Redirect}?path=${pathname}${search}`;
                break;
            }
        }
    }, []);

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
            <CreateEdit />
            <Box className="sb-private-router">
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path="/">
                            <RouterRedirect to={Routes.Private.Boats} />
                        </Route>
                        <Route path={Routes.Private.Boats}>
                            <Boat />
                        </Route>
                        <Route path={Routes.Private.Invite}>
                            <Invite />
                        </Route>
                        <Route path={Routes.Private.Error}>
                            <Error />
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
