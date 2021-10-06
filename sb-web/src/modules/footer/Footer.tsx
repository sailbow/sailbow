import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Stack, StackDivider, Text, Link, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { IoLogoInstagram as Instagram, IoLogoGithub as GitHub, IoLogoFacebook as Facebook } from 'react-icons/io5';

import { ReactComponent as IconLogoType } from 'assets/icon-logo-type.svg';
import { SingleSelect } from 'components/select/Select';
import { Subscribe } from 'modules/footer/Subscribe';

const Languages = [
    {
        label: 'English (US)',
        value: 'en_US',
    },
];

export const Footer: FunctionComponent = () => {
    return (
        <Box as="footer" role="contentinfo" mx="auto" py="12" px={{ base: '4', md: '8' }}>
            <Stack spacing="10" divider={<StackDivider />}>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '10', lg: '28' }}>
                    <Box flex="1">
                        <IconLogoType width="150px" />
                        <HStack spacing="4">
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <Instagram />
                            </IconButton>
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <Facebook />
                            </IconButton>
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <GitHub />
                            </IconButton>
                        </HStack>
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10', md: '20' }}>
                        <Box>
                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                Product
                            </Heading>
                            <Flex textAlign="start" flexDir="column" pt="4">
                                <Link href="/">About Us</Link>
                                <Link href="/">How it works</Link>
                                <Link href="/">FAQ</Link>
                                <Link href="/">Contact</Link>
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
                        <Subscribe />
                    </Stack>
                </Stack>
                <Stack
                    direction={{ base: 'column-reverse', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text fontSize="sm">&copy; {new Date().getFullYear()} Sailboat, Inc. All rights reserved.</Text>
                    <Stack
                        direction={{ base: 'column-reverse', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Flex alignItems="center" fontSize="sm">
                            <Text pr="2">Language & Region: </Text>
                            <SingleSelect
                                isSearchable={false}
                                options={Languages}
                                defaultValue={Languages[0]}
                                onChange={(e: any) => {
                                    console.log('Language Selected', e.label);
                                }}
                            />
                        </Flex>
                        <Flex alignItems="center" fontSize="sm">
                            <Text pr="2">Status</Text>
                            <Tooltip label="Active">
                                <Box h="10px" w="10px" bg="brand.success" borderRadius="50%" />
                            </Tooltip>
                        </Flex>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};
