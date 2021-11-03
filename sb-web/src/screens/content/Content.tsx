import React, { FunctionComponent, lazy, Suspense } from 'react';

import { Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { Footer } from 'modules/footer/Footer';
import { Navbar } from 'modules/navbar/Navbar';
import { BaseNavbar } from 'screens/whitelisted/Base';
import { Routes } from 'util/Routing';

import 'screens/content/Content.scss';

/** Public Content */
const Landing = lazy(() => import('screens/landing/Landing').then((module) => ({ default: module.Landing })));
const Redirect = lazy(() => import('screens/redirect/Redirect').then((module) => ({ default: module.Redirect })));

/** Whitelisted Content */
const AboutUs = lazy(() => import('screens/whitelisted/AboutUs').then((module) => ({ default: module.AboutUs })));
const HowItWorks = lazy(() =>
    import('screens/whitelisted/HowItWorks').then((module) => ({ default: module.HowItWorks })),
);
const FAQ = lazy(() => import('screens/whitelisted/FAQ').then((module) => ({ default: module.FAQ })));
const Contact = lazy(() => import('screens/whitelisted/Contact').then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import('screens/whitelisted/Terms').then((module) => ({ default: module.Terms })));
const Privacy = lazy(() => import('screens/whitelisted/Privacy').then((module) => ({ default: module.Privacy })));
const License = lazy(() => import('screens/whitelisted/License').then((module) => ({ default: module.License })));
const NotFound = lazy(() => import('screens/not-found/NotFound').then((module) => ({ default: module.NotFound })));

/** Private Content */
const Home = lazy(() => import('boats/home/Home').then((module) => ({ default: module.Home })));
const Create = lazy(() => import('boats/create/Create').then((module) => ({ default: module.Create })));

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
                        <Route path={Routes.Public.Login}>
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

export const PrivateContent: FunctionComponent = () => {
    return (
        <>
            <Navbar isAuth />
            <Box className="sb-private-content">
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path={Routes.Private.Home}>
                            <Home />
                        </Route>
                        <Route path={Routes.Private.Create}>
                            <Create />
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
