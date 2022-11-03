import { FunctionComponent, lazy, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { BoatCreate } from './boat-create/BoatCreate';
import { BoatModulesPicker } from './boat-modules/boat-modules-picker/BoatModulesPicker';
import { BoatCrew } from './boat-crew/BoatCrew';
import { BoatInviteModal } from './common/boat-invite-modal/BoatInvite';
import SystemLayout from 'modules/boats/boat-layout/BoatLayout';
import { useBoat } from './Boat.Store';
import { BoatViewMode } from './Boat.Types';

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
    const location = useLocation();
    const [, { setViewMode }] = useBoat();

    useEffect(() => {
        const rl = location.pathname.split('/').length - 1;

        switch (rl) {
            case 1:
                setViewMode(BoatViewMode.Home);
                break;
            case 2:
                setViewMode(BoatViewMode.Boat);
                break;
            default:
                setViewMode(BoatViewMode.Home);
                break;
        }
    }, [location]);

    return (
        <SystemLayout>
            <Box px="4" h="100%" id="sb-main" w="100%">
                <BoatCreate />
                <BoatCrew />
                <BoatModulesPicker />
                <BoatInviteModal />
                <Routes>
                    <Route path={BoatRoutes.AllBoats} element={<BoatHome />} />
                    <Route path={BoatRoutes.View} element={<BoatView />} />
                </Routes>
            </Box>
        </SystemLayout>
    );
};
