import { IconButton, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { FC } from 'react';
import { SbSortIcon } from 'shared/icons/Icons';

import { SingleSelect } from 'shared/select/Select';

export const HomeSort: FC = () => {
    return (
        <Menu>
            <MenuButton as={IconButton} variant="icon" fontSize="2xl">
                <IconButton aria-label="filter" variant="icon" fontSize="2xl">
                    <SbSortIcon />
                </IconButton>
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
