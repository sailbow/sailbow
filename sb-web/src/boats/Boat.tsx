import React, { FunctionComponent, useEffect, lazy } from 'react';

import { Box } from '@chakra-ui/react';
import { Route } from 'react-router-dom';

import { useBoat } from 'boats/Boat.Store';
import { Routes } from 'router/Router.Types';
import { HttpStatus } from 'util/http/Http';
import { ErrorCode, getErrorPath } from 'util/error/Error';

const BoatView = lazy(() => import('boats/view/BoatView').then((module) => ({ default: module.BoatView })));

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
        <Box px="4" h="100%">
            <Route exact path={Routes.Private.Boats}>
                <div>Home Page</div>
            </Route>
            <Route exact path={`${Routes.Private.Boats}${BoatRoutes.View}`}>
                <BoatView />
            </Route>
        </Box>
    );
};
