import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Stack, StackDivider, Text, Link, HStack, IconButton, Tooltip } from '@chakra-ui/react';

import { ReactComponent as IconLogoType } from 'assets/icon-logo-type.svg';
import { SingleSelect } from 'components/select/Select';
import { Subscribe } from 'modules/footer/Subscribe';
import { Facebook, Instagram, GitHub } from 'util/Icons';
import { Routes } from 'util/Routing';

const Languages = [
    {
        label: 'English (US)',
        value: 'en_US',
    },
];

const ProductRoutes = [
    {
        label: 'About Us',
        href: Routes.Whitelisted.AboutUs,
    },
    {
        label: 'How it works',
        href: Routes.Whitelisted.HowItWorks,
    },
    {
        label: 'FAQ',
        href: Routes.Whitelisted.FAQ,
    },
    {
        label: 'Contact',
        href: Routes.Whitelisted.Contact,
    },
];

const LegalRoutes = [
    {
        label: 'Privacy',
        href: Routes.Whitelisted.Privacy,
    },
    {
        label: 'Terms',
        href: Routes.Whitelisted.Terms,
    },
    {
        label: 'License',
        href: Routes.Whitelisted.License,
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
                                {ProductRoutes.map((route) => (
                                    <Link href={route.href}>{route.label}</Link>
                                ))}
                            </Flex>
                        </Box>
                        <Box>
                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                Legal
                            </Heading>
                            <Flex textAlign="start" flexDir="column" pt="4">
                                {LegalRoutes.map((route) => (
                                    <Link href={route.href}>{route.label}</Link>
                                ))}
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
                            <Text pr="2" fontWeight="normal">
                                Language & Region:{' '}
                            </Text>
                            <SingleSelect
                                isSearchable={false}
                                options={Languages}
                                defaultValue={Languages[0]}
                                onChange={(e: any) => {
                                    console.log('Language Selected', e.label);
                                }}
                            />
                        </Flex>
                        <Flex alignItems="center" fontSize="sm" pl={{ base: '0', md: '2' }}>
                            <Text pr="2" fontWeight="normal">
                                Status
                            </Text>
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
