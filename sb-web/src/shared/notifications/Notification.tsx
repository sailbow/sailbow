import React, { FunctionComponent } from 'react';

import {
    Box,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Heading,
} from '@chakra-ui/react';
import { SbBellIcon } from 'util/icons/Icons';

interface Props {
    display: any;
}

export const Notification: FunctionComponent<Props> = ({ display }) => {
    return (
        <Box display={display}>
            <Popover variant="brand">
                <PopoverTrigger>
                    <IconButton aria-label="notification" variant="icon" fontSize="xl">
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
        </Box>
    );
};
