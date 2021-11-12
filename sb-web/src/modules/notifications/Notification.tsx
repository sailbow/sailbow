import React, { FunctionComponent } from 'react';

import {
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Heading,
} from '@chakra-ui/react';
import { SbBellIcon } from 'util/icons/Icons';

export const Notification: FunctionComponent = () => {
    return (
        <Popover variant="responsive">
            <PopoverTrigger>
                <IconButton aria-label="notification" variant="ghost" colorScheme="gray">
                    <SbBellIcon />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent width="400px">
                <PopoverHeader>
                    <Heading fontSize="xl">Notifications</Heading>
                </PopoverHeader>
                <PopoverBody>Notification Body</PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
