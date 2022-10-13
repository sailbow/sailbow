import { FunctionComponent, useEffect, lazy } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { HttpStatus } from 'shared/http/Http';
import { ErrorCode, getErrorPath } from 'shared/error/Error';
import { BoatCreate } from './boat-create/BoatCreate';

const BoatView = lazy(() => import('modules/boats/boat-view/BoatView').then((module) => ({ default: module.BoatView })));
const BoatHome = lazy(() => import('modules/boats/boat-home/BoatHome').then((module) => ({ default: module.BoatHome })));

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
            <BoatCreate />
            <Routes>
                <Route path={BoatRoutes.AllBoats} element={<BoatHome />} />
                <Route path={BoatRoutes.View} element={<BoatView />} />
            </Routes>
        </Box>
    );
};
