import React, { FunctionComponent } from 'react';

import { Avatar, Box, Menu, MenuButton, MenuItem, MenuGroup, MenuDivider, MenuList } from '@chakra-ui/react';

import { useProfile } from 'modules/profile/Profile';
import { AuthEndpoints } from 'util/Endpoints';
import { Http, resetLocalStorage } from 'util/Http';
import { SbQuestionIcon, Privacy, SbTermsIcon, User, Logout, SbMailIcon } from 'util/Icons';
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
        route: Routes.Whitelisted.Terms,
        icon: <SbTermsIcon />,
    },
    {
        label: 'FAQ',
        route: Routes.Whitelisted.FAQ,
        icon: <SbQuestionIcon />,
    },
    {
        label: 'Contact',
        route: Routes.Whitelisted.Contact,
        icon: <SbMailIcon />,
    },
];

export const ProfileIcon: FunctionComponent = () => {
    const [profileContainer] = useProfile();

    const onLogout = async () => {
        await Http(AuthEndpoints.Logout);
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
                    <Avatar name={profileContainer.profile?.name} size="sm" h="35px" w="35px" />
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
