import React, { FunctionComponent } from 'react';
import { Box, Button, Center, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { FcGoogle as GoogleIcon } from 'react-icons/fc';
import { HiArrowRight as RightIcon } from 'react-icons/hi';
import { ImFacebook as FacebookIcon } from 'react-icons/im';

import { ReactComponent as LogoType } from 'assets/sb-gradient-logo-type.svg';

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
                                <Divider pt="1" width="20%" />
                            </Center>
                        </Box>
                        <VStack spacing="4">
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                leftIcon={<GoogleIcon />}
                                rightIcon={<RightIcon />}
                            >
                                <Text pr="8">Continue with Google</Text>
                            </Button>
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                leftIcon={<FacebookIcon />}
                                rightIcon={<RightIcon />}
                            >
                                <Text pr="3.5">Continue with Facebook</Text>
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
            <Flex
                w="65%"
                className="left-container"
                h="100%"
                display={{ base: 'none', lg: 'block' }}
                position="relative"
            />
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
