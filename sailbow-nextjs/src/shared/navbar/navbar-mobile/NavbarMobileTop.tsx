import { FC, useEffect, useState } from 'react';

import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useLocation, matchRoutes } from 'react-router-dom';

import { useBoat } from '@/modules/boats/Boat.Store';
import { Role } from '@/modules/boats/Boat.Types';
import { ProfileIcon } from '@/modules/profile/profile-icon/ProfileIcon';
import { useSystem } from '@/modules/system/System.Store';
import { Routes } from 'router/Router.Types';
import { Actions } from 'shared/actions/Actions';
import { Logo, SbChevronLeft, SbLinkIcon, SbPlusIcon, SbSettingsIcon } from 'shared/icons/Icons';
import { MoreMenu } from 'shared/more-menu/MoreMenu';
import { NavbarProps } from 'shared/navbar/Navbar.Types';

import 'shared/navbar/Navbar.scss';

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
    const [, { openCreateNav }] = useSystem();

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
        <Flex className="sb-navbar desktop" justifyContent="space-between" alignItems="center" px="2" py="2" bg="white">
            {viewMode === ViewMode.Home && (
                <>
                    <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats)} />
                    <Flex alignItems="center" gap="2">
                        <IconButton
                            aria-label="start-boat"
                            icon={<SbPlusIcon />}
                            fontSize="xl"
                            onClick={openCreateNav}
                        />
                        {/* <Notifications /> */}
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
                    <MoreMenu
                        options={[
                            {
                                id: 'boat-more-menu-share',
                                label: 'Share',
                                icon: <SbLinkIcon />,
                            },
                            {
                                id: 'boat-more-menu-settings',
                                label: 'Settings',
                                icon: <SbSettingsIcon />,
                                role: Role.Captain,
                                acceptedRoles: Actions.BoatSettings,
                            },
                        ]}
                    />
                </>
            )}
        </Flex>
    );
};
