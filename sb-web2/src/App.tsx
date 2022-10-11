import { FC, useState } from 'react';

import { Container } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { Authenticator, AuthStoreProvider } from 'modules/auth/Auth.Store';
import { BoatProvider } from 'modules/boats/Boat.Store';
import { PrivateRouter, PublicRouter, WhitelistedRouter } from 'router/Router';
import { WhitelistedRoutes } from 'router/Router.Types';
import { HttpInterceptor } from 'shared/http/HttpInterceptor';

import './App.scss';

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
