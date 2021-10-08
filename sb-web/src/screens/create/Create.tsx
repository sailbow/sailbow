import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Input, Stack, Textarea } from '@chakra-ui/react';

import 'screens/create/Create.scss';

export const Create: FunctionComponent = () => {
    return (
        <Flex flexDir="column" className="sb-create container" px={{ base: '4', md: '8' }}>
            <Stack spacing="4">
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                    Start a boat
                </Heading>

                <Stack spacing="2">
                    <Input variant="brand" fontSize="4xl" placeholder="Boat name..." fontWeight="semibold" py="8" />
                    <Textarea rows={4} variant="brand" placeholder="What is your boat about?" />
                </Stack>
            </Stack>
        </Flex>
    );
};
