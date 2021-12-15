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
            <Box px="1">
                <Banner banner={boat.banner} showControls={false} />
            </Box>
            <Box pt="4">
                <TextEdit px="2" fontSize="xl" editable type="heading">
                    {boat.name}
                </TextEdit>

                <TextEdit type="text" fontWeight="normal" color="gray.500" editable>
                    {boat.description}
                </TextEdit>
            </Box>
        </Box>
    );
};
