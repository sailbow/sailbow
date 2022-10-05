import { FunctionComponent, useEffect, lazy } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { HttpStatus } from 'shared/http/Http';
import { ErrorCode, getErrorPath } from 'shared/error/Error';
import { CreateEdit } from './create-edit/CreateEdit';

const BoatView = lazy(() => import('modules/boats/view/BoatView').then((module) => ({ default: module.BoatView })));
const Home = lazy(() => import('modules/boats/home/Home').then((module) => ({ default: module.Home })));

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
        <Box p="4" h="100%" id="sb-main">
            <CreateEdit />
            <Routes>
                <Route path={BoatRoutes.AllBoats} element={<Home />} />
                <Route path={BoatRoutes.View} element={<BoatView />} />
            </Routes>
            {/* <Route path={`${Routes.Private.Boats}${BoatRoutes.View}`}>
                <BoatView />
            </Route> */}
        </Box>
    );
};
