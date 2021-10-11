import React, { FunctionComponent } from 'react';

import { InputGroup, InputLeftAddon } from '@chakra-ui/react';
import Select from 'react-select';

import { customStyles } from 'modules/user-search/UserSearchSelectStyles';
import { Person } from 'util/Icons';

export const UserSearch: FunctionComponent = () => {
    return (
        <>
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon>
                    <Person />
                </InputLeftAddon>
                <Select placeholder="Type name or email..." styles={customStyles} />
            </InputGroup>
        </>
    );
};
