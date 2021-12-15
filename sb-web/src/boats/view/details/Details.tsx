import React, { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

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
                <TextEdit px="2" fontSize="xl" type="heading" editable>
                    {boat.name}
                </TextEdit>
                <TextEdit px="2" mt="2" type="text" fontWeight="normal" color="gray.500" editable>
                    {boat.description}
                </TextEdit>
            </Box>
        </Box>
    );
};
