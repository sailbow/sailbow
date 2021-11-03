import React, { FunctionComponent } from 'react';

import { Box, Button, Center, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';

import { ReactComponent as LogoType } from 'assets/sb-gradient-logo-type.svg';
import { AuthEndpoints } from 'util/Endpoints';
import { Http } from 'util/Http';
import { RightIcon, Facebook as FacebookLogo, Google as GoogleLogo } from 'util/Icons';

export enum Providers {
    Google,
    Facebook,
}

export const ProviderToUriMapper: Record<string, string> = {
    [Providers.Google]: process.env.REACT_APP_GOOGLE_REDIRECT_URI!,
    [Providers.Facebook]: process.env.REACT_APP_FACEBOOK_REDIRECT_URI!,
};

export const AuthCard: FunctionComponent = () => {
    const onLogin = async (provider: Providers) => {
        const { data }: AxiosResponse = await Http({
            method: AuthEndpoints.Login.method,
            url: AuthEndpoints.Login.url,
            params: {
                provider,
                redirectUri: ProviderToUriMapper[provider],
            },
        });

        window.open(data, '_self');
        console.log(data);
    };

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
                    <VStack spacing="5" pb="8">
                        <Button
                            variant="outline"
                            colorScheme="gray"
                            leftIcon={<GoogleLogo />}
                            rightIcon={<RightIcon />}
                            onClick={() => onLogin(Providers.Google)}
                        >
                            <Text style={{ paddingRight: '2rem' }}>Log In with Google</Text>
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme="gray"
                            leftIcon={<FacebookLogo />}
                            rightIcon={<RightIcon />}
                            onClick={() => onLogin(Providers.Facebook)}
                        >
                            <Text pr="3.5">Log In with Facebook</Text>
                        </Button>
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
};
