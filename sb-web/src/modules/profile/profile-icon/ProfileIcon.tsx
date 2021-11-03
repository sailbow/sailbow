import React, { FunctionComponent } from 'react';

import { Avatar, Menu, MenuButton, MenuItem, MenuList, MenuGroup, MenuDivider, Box } from '@chakra-ui/react';

import { useProfile } from 'modules/profile/Profile';
import { FAQ, Privacy, Terms, User, Logout, Envelope } from 'util/Icons';

import 'modules/profile/profile-icon/ProfileIcon.scss';
import { resetLocalStorage } from 'util/Http';
import { Routes } from 'util/Routing';

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
                <MenuButton>
                    <Avatar name={profileContainer.profile?.name} size="sm" h="40px" w="40px" />
                </MenuButton>
                <MenuList fontWeight="normal">
                    <MenuGroup title="Profile">
                        <MenuItem icon={<User height="20px" />}>My Account</MenuItem>
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
