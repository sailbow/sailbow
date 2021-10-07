import React, { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { Base } from 'screens/whitelisted/Base';

export const Contact: FunctionComponent = () => {
    return (
        <Base title="About Us">
            <Box>This is the contact page</Box>
        </Base>
    );
};
