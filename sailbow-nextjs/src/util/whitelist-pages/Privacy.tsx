import { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { Base } from 'util/whitelist-pages/Base';

export const Privacy: FunctionComponent = () => {
    return (
        <Base title="Privacy">
            <Box>This is the privacy page</Box>
        </Base>
    );
};
