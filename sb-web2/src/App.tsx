import { FC, useState } from 'react';

import { Box, Container } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { Authenticator, AuthStoreProvider } from 'modules/auth/Auth.Store';
import { PrivateRouter, PublicRouter, WhitelistedRouter } from 'router/Router';
import { HttpInterceptor } from 'shared/http/HttpInterceptor';
// import { Navbar } from 'shared/navbar/Navbar';

import './App.scss';
import { WhitelistedRoutes } from 'router/Router.Types';
import { BoatProvider } from 'modules/boats/Boat.Store';

export const App: FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    if (WhitelistedRoutes.includes(window.location.pathname)) {
        return (
            <>
                <BrowserRouter>
                    <WhitelistedRouter />
                </BrowserRouter>
            </>
        );
    }

    return (
        <Container className="App" maxW="8xl" p="0">
            <BrowserRouter>
                <AuthStoreProvider>
                    <HttpInterceptor />
                    <Authenticator onAuthLoadingChange={setLoading} onLoggedInChange={setIsLoggedIn}>
                        {!loading ? (
                            <>
                                {/* <Navbar /> */}

                                {isLoggedIn ? (
                                    <BoatProvider>
                                        <PrivateRouter />
                                    </BoatProvider>
                                ) : (
                                    <PublicRouter />
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </Authenticator>
                </AuthStoreProvider>
            </BrowserRouter>
        </Container>
    );
};
