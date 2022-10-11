import { FC } from 'react';

import { IconButton, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';

import { SbSortIcon } from 'shared/icons/Icons';

export const HomeSort: FC = () => {
    return (
        <Menu>
            <MenuButton as={IconButton} variant="icon" fontSize="2xl">
                <SbSortIcon />
            </MenuButton>
            <MenuList fontWeight="normal">
                <MenuGroup title="Sort By" fontSize="medium">
                    <MenuDivider mx="4" />
                    <MenuItem px="4">None</MenuItem>
                    <MenuItem px="4">Upcoming Date</MenuItem>
                    <MenuItem px="4">Crew Size</MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};
