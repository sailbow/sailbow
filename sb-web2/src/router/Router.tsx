import React, { FunctionComponent, lazy, Suspense, useEffect } from 'react';

import { Routes, Route, matchPath } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// import { CreateEdit } from 'modules/boats/create-edit/CreateEdit';
import { Footer } from 'shared/footer/Footer';
// import { Navbar } from 'shared/navbar/Navbar';
// import { BaseNavbar } from 'util/whitelisted/Base';
import { PrivateRoutes, Routes as AppRoutes } from 'router/Router.Types';

import { NavbarHeight } from 'theme';

/** Public Content */
const Login = lazy(() => import('modules/auth/login/Login').then((module) => ({ default: module.Login })));
const Authorize = lazy(() =>
    import('modules/auth/authorize/Authorize').then((module) => ({ default: module.Authorize })),
);
// const Redirect = lazy(() => import('modules/auth/redirect/Redirect').then((module) => ({ default: module.Redirect })));
// const Login = lazy(() => import('modules/auth/login/Login').then((module) => ({ default: module.Login })));

/** Whitelisted Content */
// const AboutUs = lazy(() => import('util/whitelisted/AboutUs').then((module) => ({ default: module.AboutUs })));
// const HowItWorks = lazy(() => import('util/whitelisted/HowItWorks').then((module) => ({ default: module.HowItWorks })));
// const FAQ = lazy(() => import('util/whitelisted/FAQ').then((module) => ({ default: module.FAQ })));
// const Contact = lazy(() => import('util/whitelisted/Contact').then((module) => ({ default: module.Contact })));
// const Terms = lazy(() => import('util/whitelisted/Terms').then((module) => ({ default: module.Terms })));
// const Privacy = lazy(() => import('util/whitelisted/Privacy').then((module) => ({ default: module.Privacy })));
// const License = lazy(() => import('util/whitelisted/License').then((module) => ({ default: module.License })));
// const NotFound = lazy(() => import('util/not-found/NotFound').then((module) => ({ default: module.NotFound })));

/** Private Content */
// const Boat = lazy(() => import('modules/boats/Boat').then((module) => ({ default: module.Boat })));
// const Invite = lazy(() => import('modules/boats/invite/Invite').then((module) => ({ default: module.Invite })));
// const Error = lazy(() => import('util/error/Error').then((module) => ({ default: module.Error })));

// export const WhitelistedRouter: FunctionComponent = () => {
//     return (
//         <>
//             <BaseNavbar />
//             <Box className="sb-whitelisted-router">
//                 <Suspense fallback={null}>
//                     <Switch>
//                         <Route path={AppRoutes.Whitelisted.AboutUs}>
//                             <AboutUs />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.HowItWorks}>
//                             <HowItWorks />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.FAQ}>
//                             <FAQ />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.Contact}>
//                             <Contact />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.Privacy}>
//                             <Privacy />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.Terms}>
//                             <Terms />
//                         </Route>
//                         <Route path={AppRoutes.Whitelisted.License}>
//                             <License />
//                         </Route>
//                         <Route path="*">
//                             <NotFound />
//                         </Route>
//                     </Switch>
//                 </Suspense>
//                 <Footer />
//             </Box>
//         </>
//     );
// };

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
            {/* <Navbar isAuth={false} /> */}
            <Box className="sb-public-router" pt={NavbarHeight}>
                <Suspense fallback={null}>
                    <Routes>
                        <Route path={AppRoutes.Public.Landing} element={<Login />} />

                        <Route path={AppRoutes.Public.Login} element={<Authorize />} />

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
            {/* <Navbar isAuth />
            <CreateEdit /> */}
            <Box className="sb-private-router" pt={NavbarHeight}>
                <Routes>
                    <Route path="/boats" element={<span>Private stuff</span>} />
                </Routes>
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
