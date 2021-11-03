import React, { FunctionComponent } from 'react';

import { Avatar, Box, Menu, MenuButton, MenuItem, MenuGroup, MenuDivider, MenuList } from '@chakra-ui/react';

import { useProfile } from 'modules/profile/Profile';
import { resetLocalStorage } from 'util/Http';
import { FAQ, Privacy, Terms, User, Logout, Envelope } from 'util/Icons';
import { Routes } from 'util/Routing';

import 'modules/profile/profile-icon/ProfileIcon.scss';

const HelpOptions = [
    {
        label: 'Privacy',
        route: Routes.Whitelisted.Privacy,
        icon: <Privacy />,
    },
    {
        label: 'Terms',
        route: Routes.Whitelisted.Privacy,
        icon: <Terms />,
    },
    {
        label: 'FAQ',
        route: Routes.Whitelisted.Privacy,
        icon: <FAQ />,
    },
    {
        label: 'Contact',
        route: Routes.Whitelisted.Privacy,
        icon: <Envelope />,
    },
];

export const ProfileIcon: FunctionComponent = () => {
    const [profileContainer] = useProfile();

    const onLogout = () => {
        resetLocalStorage();
        window.location.href = Routes.Public.Landing;
    };

    const onRoute = (route: string) => {
        window.location.href = route;
    };

    return (
        <Box className="sb-profile-icon">
            <Menu>
                <MenuButton className="button">
                    <Avatar name={profileContainer.profile?.name} size="sm" h="40px" w="40px" />
                </MenuButton>
                <MenuList fontWeight="normal">
                    <MenuGroup title="Profile">
                        <MenuItem icon={<User height="20px" />}>My Profile</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Help">
                        {HelpOptions.map(({ label, icon, route }) => (
                            <MenuItem key={label} icon={icon} onClick={() => onRoute(route)}>
                                {label}
                            </MenuItem>
                        ))}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem icon={<Logout />} onClick={onLogout}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};
