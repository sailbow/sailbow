import { FunctionComponent } from 'react';

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
import { SbBellIcon } from 'shared/icons/Icons';

export const Notifications: FunctionComponent = () => {
    return (
        <Box>
            <Popover variant="brand" isLazy lazyBehavior="unmount">
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
