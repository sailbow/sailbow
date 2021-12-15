import React, { FunctionComponent } from 'react';

import { Box, Heading } from '@chakra-ui/react';

import { Boat } from 'boats/Boat.Types';
import { Banner } from 'boats/components';
import { TextEdit } from 'components/text-edit/TextEdit';

interface Props {
    boat: Boat;
}

export const Details: FunctionComponent<Props> = ({ boat }) => {
    return (
        <Box flex="0.2" display={{ base: 'none', md: 'block' }}>
            <Box px="2">
                <Banner banner={boat.banner} showControls={false} />
            </Box>
            <Box pt="4">
                <Heading px="2" fontSize="xl" _hover={{ bg: 'gray.100' }} transition="0.25s all ease-in-out">
                    {boat.name}
                </Heading>

                <TextEdit fontWeight="normal" color="gray.500" editable>
                    {boat.description}
                </TextEdit>
            </Box>
        </Box>
    );
};
