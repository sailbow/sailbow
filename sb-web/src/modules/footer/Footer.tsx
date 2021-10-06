import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Input, Stack, StackDivider, Text, Link, HStack, Button } from '@chakra-ui/react';

import { ReactComponent as IconLogoType } from 'assets/icon-logo-type.svg';

export const Footer: FunctionComponent = () => {
    return (
        <Box as="footer" role="contentinfo" mx="auto" py="12" px={{ base: '4', md: '8' }}>
            <Stack spacing="10" divider={<StackDivider />}>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '10', lg: '28' }}>
                    <Box flex="1">
                        <IconLogoType width="150px" />
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10', md: '20' }}>
                        <Box>
                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                Product
                            </Heading>
                            <Flex textAlign="start" flexDir="column" pt="4">
                                <Link href="/">About Us</Link>
                                <Link href="/">How it works</Link>
                                <Link href="/">Use Cases</Link>
                            </Flex>
                        </Box>
                        <Box>
                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                Legal
                            </Heading>
                            <Flex textAlign="start" flexDir="column" pt="4">
                                <Link href="/">Privacy</Link>
                                <Link href="/">Terms</Link>
                                <Link href="/">License</Link>
                            </Flex>
                        </Box>
                        <Box>
                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                Subscribe to our newsletter
                            </Heading>
                            <Flex textAlign="start" flexDir="column" pt="4">
                                <Text>Get notified when we have exciting news for you.</Text>
                                <HStack>
                                    <Input placeholder="Enter your email" mt="2" />
                                    <Button px="8">Subscribe</Button>
                                </HStack>
                            </Flex>
                        </Box>
                    </Stack>
                </Stack>
                <Stack
                    direction={{ base: 'column-reverse', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text fontSize="sm">&copy; {new Date().getFullYear()} Sailboat, Inc. All rights reserved.</Text>
                    {/* <Copyright />
                    <SocialMediaLinks /> */}
                </Stack>
            </Stack>
        </Box>
    );
};
