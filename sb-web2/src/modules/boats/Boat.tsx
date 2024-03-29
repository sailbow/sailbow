import { FunctionComponent, lazy } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

import { BoatCreate } from './boat-create/BoatCreate';
import { BoatModulesPicker } from './boat-modules/boat-modules-picker/BoatModulesPicker';
import { BoatCrew } from './boat-crew/BoatCrew';
import { BoatInviteModal } from './common/boat-invite-modal/BoatInvite';

const BoatView = lazy(() =>
    import('modules/boats/boat-view/BoatView').then((module) => ({ default: module.BoatView })),
);
const BoatHome = lazy(() =>
    import('modules/boats/boat-home/BoatHome').then((module) => ({ default: module.BoatHome })),
);

export enum BoatRoutes {
    AllBoats = '/',
    View = '/:boatId',
}

export const Boat: FunctionComponent = () => {
    return (
        <Box px="4" h="100%" id="sb-main">
            <BoatCreate />
            <BoatCrew />
            <BoatModulesPicker />
            <BoatInviteModal />
            <Routes>
                <Route path={BoatRoutes.AllBoats} element={<BoatHome />} />
                <Route path={BoatRoutes.View} element={<BoatView />} />
            </Routes>
        </Box>
    );
};
