import React, { FunctionComponent } from 'react';

import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { ToastActionType, useToast } from 'common/toast/Toast';

export const Subscribe: FunctionComponent = () => {
    const [, dispatch] = useToast();

    return (
        <Box>
            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                Subscribe to our newsletter
            </Heading>
            <Flex textAlign="start" flexDir="column" pt="4">
                <Text fontWeight="normal">Get notified when we have exciting news for you.</Text>
                <Flex alignItems="center" mt="2">
                    <Input placeholder="Enter your email" />
                    <Button
                        px="8"
                        variant="outline"
                        ml="2"
                        onClick={() => {
                            console.log('add email to subscription');
                            dispatch({ type: ToastActionType.ShowSuccess, text: "You've been added to the list :)" });
                        }}
                    >
                        Subscribe
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};
