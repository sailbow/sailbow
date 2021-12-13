import React, { FunctionComponent } from 'react';

import { Flex, IconButton } from '@chakra-ui/react';

import { SbSettingsIcon, SbUserGroup } from 'util/icons/Icons';

export const Toolbar: FunctionComponent = () => {
    return (
        <Flex>
            <IconButton fontSize="xl" aria-label="settings" colorScheme="gray" variant="ghost" icon={<SbUserGroup />} />
            <IconButton
                fontSize="xl"
                aria-label="settings"
                colorScheme="gray"
                variant="ghost"
                icon={<SbSettingsIcon />}
            />
        </Flex>
    );
};
