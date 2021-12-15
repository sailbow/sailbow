import React, { FunctionComponent } from 'react';

import { Box, Flex, Text, Heading, IconButton } from '@chakra-ui/react';

import { Boat } from 'boats/Boat.Types';
import { Banner } from 'boats/components';
import { SbEditIcon } from 'util/icons/Icons';

interface Props {
    boat: Boat;
}

export const Details: FunctionComponent<Props> = ({ boat }) => {
    return (
        <Box flex="0.2" display={{ base: 'none', md: 'block' }}>
            <Box>
                <Banner banner={boat.banner} showControls={false} />
            </Box>
            <Box pt="4">
                <Heading contentEditable fontSize="xl" _hover={{ bg: 'gray.100' }} transition="0.25s all ease-in-out">
                    {boat.name}
                </Heading>

                <Text pt="1" fontWeight="normal" color="gray.500">
                    {boat.description}
                </Text>
            </Box>
        </Box>
    );
};
