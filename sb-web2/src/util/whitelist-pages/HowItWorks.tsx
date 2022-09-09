import { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { Base } from 'util/whitelist-pages/Base';

export const HowItWorks: FunctionComponent = () => {
    return (
        <Base title="How It Works">
            <Box>This is the how it works page</Box>
        </Base>
    );
};
