import { FC } from 'react';

import { Flex, IconButton } from '@chakra-ui/react';
import { NavbarProps } from '../Navbar.Types';
import { SbHomeIcon, SbPlusIcon, SbUserIcon } from 'shared/icons/Icons';
import { ProfileIcon } from '@/modules/profile/profile-icon/ProfileIcon';

export const NavbarMobileBottom: FC<NavbarProps> = ({ onRoute }) => {
    return (
        <Flex bottom="0" position="fixed" w="100%" alignItems="center" justifyContent="space-around" py="2">
            <Flex w="100%" justifyContent="center">
                <IconButton aria-label="start-boat" icon={<SbHomeIcon />} variant="ghost" fontSize="2xl" />
            </Flex>
            <Flex w="100%" justifyContent="center">
                <IconButton aria-label="start-boat" icon={<SbPlusIcon />} fontSize="xl" />
            </Flex>
            <Flex w="100%" justifyContent="center">
                <ProfileIcon />
            </Flex>
        </Flex>
    );
};
