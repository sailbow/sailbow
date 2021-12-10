import React, { FunctionComponent } from 'react';

import { Box, Button, Center, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';

import { ReactComponent as LogoType } from 'assets/sb-gradient-logo-type.svg';
import { AuthEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';
import { SbRightArrowIcon, SbFacebookIcon, SbGoogleIcon } from 'util/icons/Icons';

import 'auth/auth-card/AuthCard.scss';

export enum Providers {
    Google,
    Facebook,
}

export const ProviderToUriMapper: Record<string, string> = {
    [Providers.Google]: process.env.REACT_APP_GOOGLE_REDIRECT_URI!,
    [Providers.Facebook]: process.env.REACT_APP_FACEBOOK_REDIRECT_URI!,
};

interface Props {
    path?: string;
}

export const AuthCard: FunctionComponent<Props> = ({ path }) => {
    const onLogin = async (provider: Providers) => {
        let state = '';
        if (path) {
            state = encodeURI(JSON.stringify({ path }));
        }

        const { data }: AxiosResponse = await Http({
            ...AuthEndpoints.Login(),
            params: {
                provider,
                state,
                redirectUri: ProviderToUriMapper[provider],
            },
        });

        window.open(data, '_self');
    };

    return (
        <Box boxShadow="xl" bg="white" p="12" pb="4" borderRadius="xl" className="sb-auth-card">
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
                            className="social-outline-button"
                            variant="outline"
                            colorScheme="gray"
                            leftIcon={<SbGoogleIcon />}
                            rightIcon={<SbRightArrowIcon />}
                            onClick={() => onLogin(Providers.Google)}
                        >
                            <Text style={{ paddingRight: '2rem' }}>Log In with Google</Text>
                        </Button>
                        <Button
                            className="social-outline-button"
                            variant="outline"
                            colorScheme="gray"
                            leftIcon={<SbFacebookIcon />}
                            rightIcon={<SbRightArrowIcon />}
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

AuthCard.defaultProps = {
    path: '',
};
