import React, { FunctionComponent } from 'react';

import { Button, Heading, Flex, Text } from '@chakra-ui/react';
import { CheckmarkIcon } from 'components/button/ButtonIcons';

export const Invite: FunctionComponent = () => {
    return (
        <Flex
            className="container"
            flexDir="column"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            h="100%"
        >
            <Heading>Woah, looks like you are getting ready for your next adventure!</Heading>
            <Text fontWeight="normal" mt="4">
                Someone has invited you to their boat!
            </Text>
            <Button variant="solid" size="lg" mt="16" rightIcon={CheckmarkIcon}>
                <Text>Accept Invite</Text>
            </Button>
        </Flex>
    );
};
