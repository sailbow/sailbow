import React, { FunctionComponent } from 'react';

import { InputGroup, InputLeftAddon, Stack } from '@chakra-ui/react';
import Select from 'react-select';

import { UserCard } from 'components/user-card/UserCard';
import { customStyles } from 'modules/user-search/UserSearchSelectStyles';
import { Search } from 'util/Icons';

export const UserSearch: FunctionComponent = () => {
    return (
        <Stack>
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon>
                    <Search />
                </InputLeftAddon>
                <Select placeholder="Type name or email..." styles={customStyles} />
            </InputGroup>
            <UserCard />
        </Stack>
    );
};
