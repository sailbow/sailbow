import React, { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { Base } from 'screens/whitelisted/Base';

export const Contact: FunctionComponent = () => {
    return (
        <Base
            title="Contact Us"
            subtitle="We would love to hear from you! Please let us know if you've come across any issues or would like some additional function, or if you just want to drop by and say hi!"
        >
            <Box>This is the contact page</Box>
        </Base>
    );
};
