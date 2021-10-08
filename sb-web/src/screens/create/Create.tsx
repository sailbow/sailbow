import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Stack, Textarea } from '@chakra-ui/react';

import { Input, TextArea } from 'components/input/Input';
import { Boat, ChatRight } from 'util/Icons';

import 'screens/create/Create.scss';

export const Create: FunctionComponent = () => {
    return (
        <Flex flexDir="column" className="sb-create" px={{ base: '4', md: '8' }}>
            <Stack spacing="4">
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                    Start a boat
                </Heading>

                <Stack spacing="2">
                    <Input
                        icon={<Boat />}
                        props={{
                            fontSize: '4xl',
                            placeholder: 'Boat name...',
                            fontWeight: 'semibold',
                            id: 'name',
                            py: '6',
                        }}
                    />
                    <TextArea
                        icon={<ChatRight />}
                        props={{
                            rows: 4,
                            variant: 'brand',
                            placeholder: 'What is your boat about?',
                        }}
                    />
                </Stack>
            </Stack>
        </Flex>
    );
};
