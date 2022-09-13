import React, { FunctionComponent, useEffect, lazy } from 'react';

import { Box } from '@chakra-ui/react';
import { Route } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { Routes } from 'router/Router.Types';
import { HttpStatus } from 'shared/http/Http';
import { ErrorCode, getErrorPath } from 'shared/error/Error';

// const BoatView = lazy(() => import('modules/boats/view/BoatView').then((module) => ({ default: module.BoatView })));
// const Home = lazy(() => import('modules/boats/home/Home').then((module) => ({ default: module.Home })));

enum BoatRoutes {
    AllBoats = '/',
    View = '/:boatId',
}

export const Boat: FunctionComponent = () => {
    const [{ error }] = useBoat();

    useEffect(() => {
        if (error) {
            switch (error.status) {
                case HttpStatus.NOT_FOUND:
                    window.location.href = getErrorPath(ErrorCode.BoatNotFound);
                    break;
                case HttpStatus.FORBIDDEN:
                    window.location.href = getErrorPath(ErrorCode.BoatForbidden);
                    break;
                default:
                    window.location.href = getErrorPath(ErrorCode.BoatError);
            }
        }
    }, [error]);

    return (
        <Box px="4" h="100%" id="sb-main">
            WE ARE THE BOATSSS
            {/* <Route path={Routes.Private.Boats}>
                <Home />
            </Route>
            <Route path={`${Routes.Private.Boats}${BoatRoutes.View}`}>
                <BoatView />
            </Route> */}
        </Box>
    );
};
