import { FunctionComponent, lazy, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes, useLocation, matchRoutes } from 'react-router-dom';

import { BoatCreate } from './boat-create/BoatCreate';
import { BoatModulesPicker } from './boat-modules/boat-modules-picker/BoatModulesPicker';
import { BoatCrew } from './boat-crew/BoatCrew';
import { BoatInviteModal } from './common/boat-invite-modal/BoatInvite';
import BoatLayout from 'modules/boats/boat-layout/BoatLayout';
import { useBoat } from './Boat.Store';
import { BoatViewMode } from './Boat.Types';
import { BoatToolbar } from './common/boat-toolbar/BoatToolbar';
import { BoatRoutes } from 'router/Router.Types';
import { useSystem } from 'modules/system/System.Store';

const BoatView = lazy(() =>
    import('modules/boats/boat-view/BoatView').then((module) => ({ default: module.BoatView })),
);
const BoatHome = lazy(() =>
    import('modules/boats/boat-home/BoatHome').then((module) => ({ default: module.BoatHome })),
);

export const Boat: FunctionComponent = () => {
    const location = useLocation();
    const [, { setViewMode }] = useBoat();
    const [, { setCurrentRoute }] = useSystem();

    useEffect(() => {
        const matched = matchRoutes(
            Object.values(BoatRoutes).map((v) => ({ path: `${BoatRoutes.Base}${v}` })),
            location,
        );

        if (matched) {
            const [
                {
                    route: { path },
                },
            ] = matched;

            switch (path) {
                case BoatRoutes.Base + BoatRoutes.BoatView:
                    setViewMode(BoatViewMode.Boat);
                    setCurrentRoute(BoatRoutes.BoatView);
                    window.scrollTo(0, 0);
                    break;
                default:
                    setViewMode(BoatViewMode.Home);
                    setCurrentRoute(BoatRoutes.BoatHome);
                    break;
            }
        }
    }, [location]);

    return (
        <BoatLayout>
            <Box h="100%" id="sb-boats" w="100%" px="4" mt="4">
                <BoatCreate />
                <BoatCrew />
                <BoatModulesPicker />
                <BoatInviteModal />
                <Routes>
                    <Route path={BoatRoutes.BoatHome} element={<BoatHome />} />
                    <Route path={BoatRoutes.BoatView} element={<BoatView />} />
                </Routes>
            </Box>
        </BoatLayout>
    );
};
