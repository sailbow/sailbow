import { FC, useEffect, useState } from 'react';

import { Button, Flex, IconButton, Text } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Role } from 'modules/boats/Boat.Types';
import { ProfileIcon } from 'modules/profile/profile-icon/ProfileIcon';
import { useSystem } from 'modules/system/System.Store';
import { BoatRoutes, Routes } from 'router/Router.Types';
import { Actions } from 'shared/actions/Actions';
import { Logo, SbChevronLeft, SbLinkIcon, SbPlusIcon, SbSettingsIcon } from 'shared/icons/Icons';
import { MoreMenu } from 'shared/more-menu/MoreMenu';
import { NavbarProps } from 'shared/navbar/Navbar.Types';

import 'shared/navbar/Navbar.scss';

enum ViewMode {
    Home,
    Boat,
}

export const NavbarMobileTop: FC<NavbarProps> = ({ onRoute }) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Home);
    const [{ loading, activeBoat }] = useBoat();
    const [{ currentRoute }, { openCreateNav }] = useSystem();

    useEffect(() => {
        console.log(currentRoute);
        switch (currentRoute) {
            case BoatRoutes.BoatHome:
                setViewMode(ViewMode.Home);
                break;
            case BoatRoutes.BoatView:
                setViewMode(ViewMode.Boat);
                break;
            default:
                setViewMode(ViewMode.Home);
        }
    }, [currentRoute]);

    return (
        <Flex className="sb-navbar desktop" justifyContent="space-between" alignItems="center" py="2" bg="white">
            {viewMode === ViewMode.Home && (
                <>
                    <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats.base)} />
                    <Flex alignItems="center" gap="4">
                        <Button aria-label="start-boat" size="sm" rightIcon={<SbPlusIcon />} onClick={openCreateNav}>
                            Start Boat
                        </Button>
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
                        onClick={() => onRoute(Routes.Private.Boats.base)}
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
