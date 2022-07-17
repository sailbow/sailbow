import React, { FunctionComponent } from 'react';

import { Flex, Spinner, Text } from '@chakra-ui/react';

export const Loading: FunctionComponent = () => {
    return (
        <Flex flexDir="column" w="100%" h="100%" justifyContent="center" alignItems="center">
            <Spinner color="brand.teal" size="xl" />
            <Text pt="4" fontWeight="normal">
                Fetching data...
            </Text>
        </Flex>
    );
};
