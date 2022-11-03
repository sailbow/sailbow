import { FC } from 'react';

import { Box, BoxProps, Button, Flex, IconButton, Stack, Text } from '@chakra-ui/react';

import { LinkItems, SidebarWidth } from '../Layout.Types';
import { Logo, SbCloseIcon } from 'shared/icons/Icons';
// import { FcVolume2Icon, FcXIcon } from 'common/icons/Icons';
import { NavItem } from './nav-item/NavItem';
// import { ProfileSidebar } from 'screens/profile/profile-sidebar/ProfileSidebar';
import { useNavigate } from 'react-router-dom';
// import { useRoomStore } from 'screens/room/Room.Store';
import { Routes } from 'router/Router.Types';
import { useLayoutStore } from '../Layout';

interface Props extends BoxProps {
    onClose: () => void;
}

export const SidebarContent: FC<Props> = ({ onClose, ...rest }) => {
    const navigate = useNavigate();
    const [, { closeMobileNav }] = useLayoutStore();

    return (
        <Box
            zIndex={999}
            transition="0.75 ease"
            w={{ base: 'full', md: SidebarWidth }}
            pos="fixed"
            h="full"
            className="sb-sidebar"
            {...rest}
        >
            <Stack spacing="6" position="relative" h="100%">
                <Flex h="20" alignItems="center" px="8" py="4" justifyContent="space-between">
                    <Logo />
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        mr="-3"
                        aria-label="c"
                        variant="icon"
                        icon={<SbCloseIcon />}
                        onClick={onClose}
                    />
                </Flex>

                <Box>
                    {LinkItems.map((link) => (
                        <NavItem
                            px="8"
                            key={link.name}
                            icon={link.icon}
                            // selected={link.reg?.test(window.location.pathname)}
                            onClick={() => {
                                navigate(link.route!, { replace: true });
                                closeMobileNav();
                            }}
                        >
                            {link.name}
                        </NavItem>
                    ))}
                </Box>

                {/* <Box pt="2">
                    <ProfileSidebar />
                </Box> */}
            </Stack>
        </Box>
    );
};
