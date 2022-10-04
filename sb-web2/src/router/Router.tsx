import { FunctionComponent, lazy, Suspense, useEffect } from 'react';

import { Routes, Route, matchPath } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

import { Footer } from 'shared/footer/Footer';
import { PrivateRoutes, Routes as AppRoutes } from 'router/Router.Types';

import { NavbarHeight } from 'theme';
import { Navbar } from 'shared/navbar/Navbar';

/** Public Content */
const Login = lazy(() => import('modules/auth/login/Login').then((module) => ({ default: module.Login })));
const Authorize = lazy(() =>
    import('modules/auth/authorize/Authorize').then((module) => ({ default: module.Authorize })),
);
const Redirect = lazy(() => import('modules/auth/redirect/Redirect').then((module) => ({ default: module.Redirect })));
// const Login = lazy(() => import('modules/auth/login/Login').then((module) => ({ default: module.Login })));

/** Whitelisted Content */
const AboutUs = lazy(() => import('util/whitelist-pages/AboutUs').then((module) => ({ default: module.AboutUs })));
const HowItWorks = lazy(() =>
    import('util/whitelist-pages/HowItWorks').then((module) => ({ default: module.HowItWorks })),
);
const FAQ = lazy(() => import('util/whitelist-pages/FAQ').then((module) => ({ default: module.FAQ })));
const Contact = lazy(() => import('util/whitelist-pages/Contact').then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import('util/whitelist-pages/Terms').then((module) => ({ default: module.Terms })));
const Privacy = lazy(() => import('util/whitelist-pages/Privacy').then((module) => ({ default: module.Privacy })));
const License = lazy(() => import('util/whitelist-pages/License').then((module) => ({ default: module.License })));
// const NotFound = lazy(() => import('util/not-found/NotFound').then((module) => ({ default: module.NotFound })));

/** Private Content */
const Boat = lazy(() => import('modules/boats/Boat').then((module) => ({ default: module.Boat })));
// const Invite = lazy(() => import('modules/boats/invite/Invite').then((module) => ({ default: module.Invite })));
// const Error = lazy(() => import('util/error/Error').then((module) => ({ default: module.Error })));

export const WhitelistedRouter: FunctionComponent = () => {
    return (
        <>
            <Container className="sb-whitelisted-router" maxW="container.lg">
                <Suspense fallback={null}>
                    <Routes>
                        <Route path={AppRoutes.Whitelisted.AboutUs} element={<AboutUs />} />
                        <Route path={AppRoutes.Whitelisted.HowItWorks} element={<HowItWorks />} />
                        <Route path={AppRoutes.Whitelisted.FAQ} element={<FAQ />} />
                        <Route path={AppRoutes.Whitelisted.Contact} element={<Contact />} />
                        <Route path={AppRoutes.Whitelisted.Privacy} element={<Privacy />} />
                        <Route path={AppRoutes.Whitelisted.Terms} element={<Terms />} />
                        <Route path={AppRoutes.Whitelisted.License} element={<License />} />
                        {/* <Route path="*">
                            <NotFound />
                        </Route> */}
                    </Routes>
                </Suspense>
            </Container>
            <Footer />
        </>
    );
};

export const PublicRouter: FunctionComponent = () => {
    // this is a hacky way. need to use regex to optimize route matching
    useEffect(() => {
        // eslint-disable-next-line
        for (const path of PrivateRoutes) {
            const { search, pathname } = window.location;
            const match = matchPath(path, pathname);

            if (match) {
                window.location.href = `${AppRoutes.Public.Redirect}?path=${pathname}${search}`;
                break;
            }
        }
    }, []);

    return (
        <>
            {/* <PublicNavbar /> */}
            <Box className="sb-public-router" h="100%" w="100%">
                <Suspense fallback={null}>
                    <Routes>
                        <Route path={AppRoutes.Public.Auth} element={<Login />} />
                        <Route path={AppRoutes.Public.Login} element={<Authorize />} />
                        <Route path={AppRoutes.Public.Redirect} element={<Redirect />} />
                        {/* <Route path={AppRoutes.Public.Redirect}>
                            <Redirect />
                        </Route> */}
                        {/* <Route path={Routes.Public.Login}>
                            <Login />
                        </Route> */}
                        {/* <Route path="*">
                            <NotFound />
                        </Route> */}
                    </Routes>
                </Suspense>
                <Footer />
            </Box>
        </>
    );
};

export const PrivateRouter: FunctionComponent = () => {
    return (
        <>
            <Navbar />
            <Box className="sb-private-router">
                <Suspense fallback={null}>
                    <Routes>
                        <Route path={`${AppRoutes.Private.Boats}/*`} element={<Boat />} />
                    </Routes>
                </Suspense>

                {/* <Suspense fallback={null}>
                    <Switch>
                        <Route exact path="/">
                            <RouterRedirect to={AppRoutes.Private.Boats} />
                        </Route>
                        <Route path={AppRoutes.Private.Boats}>
                            <Boat />
                        </Route>
                        <Route path={AppRoutes.Private.Invite}>
                            <Invite />
                        </Route>
                        <Route path={AppRoutes.Private.Error}>
                            <Error />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch> */}
                {/* </Suspense> */}
            </Box>
        </>
    );
};
