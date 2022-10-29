import { FC, useEffect, useState } from 'react';

import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useLocation, matchRoutes } from 'react-router-dom';

import { Routes } from 'router/Router.Types';
import { Logo, SbChevronLeft, SbMoreIcon, SbPlusIcon } from 'shared/icons/Icons';
import { NavbarProps } from 'shared/navbar/Navbar.Types';
import { Notifications } from 'shared/notifications/Notifications';
import { useBoat } from 'modules/boats/Boat.Store';

import 'shared/navbar/Navbar.scss';
import { ProfileIcon } from 'modules/profile/profile-icon/ProfileIcon';

enum RouteNames {
    Home = '/boats',
    Boat = '/boats/:id',
}

const routesToMatch = [
    {
        path: RouteNames.Boat,
    },
    {
        path: RouteNames.Home,
    },
];

enum ViewMode {
    Home,
    Boat,
}

export const NavbarMobileTop: FC<NavbarProps> = ({ onRoute }) => {
    const location = useLocation();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Home);
    const [{ loading, activeBoat }] = useBoat();

    useEffect(() => {
        const a = matchRoutes(routesToMatch, location);

        if (a) {
            switch (a[0].route.path) {
                case RouteNames.Home:
                    setViewMode(ViewMode.Home);
                    break;
                case RouteNames.Boat:
                    setViewMode(ViewMode.Boat);
                    break;
                default:
                    setViewMode(ViewMode.Home);
            }
        }
    }, [location]);

    return (
        <Flex
            className="sb-navbar desktop"
            justifyContent="space-between"
            alignItems="center"
            px="4"
            py="2"
            bg="white"
            transition="all 0.25s ease-in-out"
            id="sb-navbar"
        >
            {viewMode === ViewMode.Home && (
                <>
                    <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats)} />
                    <Flex alignItems="center" gap="2">
                        <IconButton aria-label="start-boat" icon={<SbPlusIcon />} fontSize="xl" />
                        <Notifications />
                        <ProfileIcon />
                    </Flex>
                </>
            )}

            {viewMode === ViewMode.Boat && (
                <>
                    <IconButton
                        aria-label="add"
                        fontSize="3xl"
                        icon={<SbChevronLeft />}
                        variant="ghost"
                        colorScheme="gray"
                        ml="-3"
                        onClick={() => onRoute(Routes.Private.Boats)}
                    />
                    {!loading.get && activeBoat && (
                        <Text fontWeight="semibold" noOfLines={1} px="4">
                            {activeBoat.name}
                        </Text>
                    )}
                    <IconButton
                        aria-label="add"
                        fontSize="2xl"
                        icon={<SbMoreIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        mr="-3"
                    />
                </>
            )}
        </Flex>
    );
};
