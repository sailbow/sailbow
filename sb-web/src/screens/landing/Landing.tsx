import React, { FunctionComponent } from 'react';

import { Box, Button, Center, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { ReactComponent as LogoType } from 'assets/sb-gradient-logo-type.svg';
import { RightIcon, Facebook, Google } from 'util/Icons';

import 'screens/landing/Landing.scss';

export const Landing: FunctionComponent = () => {
    const LandingCard: FunctionComponent = () => {
        return (
            <Box boxShadow="xl" bg="white" p="12" pb="4" borderRadius="xl">
                <VStack spacing="32">
                    <Flex textAlign="center" justifyContent="center" flexDir="column">
                        <LogoType />
                        <Text fontSize="10px" pt="2" fontWeight="semibold" color="gray.500">
                            Get The Crew. Plan The Voyage. <br />
                            Set Sail.
                        </Text>
                    </Flex>
                    <VStack spacing="6">
                        <Box textAlign="center">
                            <Heading fontSize="md">Start Sailing!</Heading>
                            <Center>
                                <Divider pt="1" width="20%" borderColor="gray.500" />
                            </Center>
                        </Box>
                        <VStack spacing="5">
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                leftIcon={<Google />}
                                rightIcon={<RightIcon />}
                            >
                                <Text style={{ paddingRight: '2rem' }}>Log In with Google</Text>
                            </Button>
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                leftIcon={<Facebook />}
                                rightIcon={<RightIcon />}
                            >
                                <Text pr="3.5">Log In with Facebook</Text>
                            </Button>
                            <Text fontSize="8px" pt="4">
                                Copyright © 2021 Sailboat
                            </Text>
                        </VStack>
                    </VStack>
                </VStack>
            </Box>
        );
    };

    return (
        <Flex className="sb-landing">
            <Flex w="65%" className="left-container" h="100%" display={{ base: 'none', lg: 'block' }} />
            <Flex
                w={{ base: '100%', lg: '45%' }}
                className="right-container"
                bgColor="white"
                justifyContent="center"
                alignItems="center"
            >
                <LandingCard />
            </Flex>
        </Flex>
    );
};
