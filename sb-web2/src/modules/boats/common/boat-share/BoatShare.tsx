import React, { FunctionComponent } from 'react';

import { Flex, IconButton, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, Button } from '@chakra-ui/react';

import { SbCopyIcon, SbLinkIcon } from 'shared/icons/Icons';

export const BoatShare: FunctionComponent = () => {
    const onCopy = () => {
        navigator.clipboard.writeText('https://sailboatapp.com/xc7wg');
    };
    return (
        <Popover variant="brand">
            <PopoverTrigger>
                <IconButton aria-label="link-icon" variant="icon" fontSize="2xl">
                    <SbLinkIcon />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent borderRadius="lg">
                <PopoverBody p="2">
                    <Flex p="2" alignItems="center" flexWrap="wrap">
                        <Text fontWeight="normal" pr="4">
                            {window.location.href}
                        </Text>
                        <Button rightIcon={<SbCopyIcon />} size="sm" colorScheme="gray" onClick={onCopy}>
                            Copy
                        </Button>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
