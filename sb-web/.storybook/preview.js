import React, { Suspense } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { theme } from 'theme/ChakraTheme.ts';

export const parameters = {
    controls: {
        expanded: true,
    },
};

export const decorators = [
    (Story) => (
        <Suspense fallback={null}>
            <ChakraProvider theme={theme}>
                <Story />
            </ChakraProvider>
        </Suspense>
    ),
];
