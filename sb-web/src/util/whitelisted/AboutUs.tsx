import React, { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { Base } from 'util/whitelisted/Base';

export const AboutUs: FunctionComponent = () => {
    return (
        <Base title="About Us">
            <Box>This is the about us page</Box>
        </Base>
    );
};
