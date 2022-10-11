import { FC } from 'react';

import { Box, Center, Heading, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { SignInForm } from 'modules/auth/auth-card/sign-in-form/SignInForm';
import { SocialButtons } from 'modules/auth/social-buttons/SocialButtons';
import { Routes } from 'router/Router.Types';
import { Logo } from 'shared/icons/Icons';

import { SignUpForm } from './sing-up-form/SignUpForm';
import { AuthCardType } from '../Auth.Types';

import './AuthCard.scss';

interface Props {
    path?: string;
    type: AuthCardType;
}

export const AuthCard: FC<Props> = ({ path, type }) => {
    const navigate = useNavigate();
    const colors = {
        card: useColorModeValue('white', 'brand.dark2'),
        cardBorder: useColorModeValue('brand.border-light', 'brand.border-dark'),
    };

    const TextDivider: FC<{ text: string }> = ({ text }) => {
        return (
            <Box
                className="text-divider"
                _before={{ bg: 'brand.muted' }}
                _after={{ bg: 'brand.muted' }}
                color="brand.secondary"
            >
                {text}
            </Box>
        );
    };

    return (
        <Box
            bg={colors.card}
            w={{ md: '450px', base: '100%' }}
            maxW="450px"
            mx={{ base: '12px', md: '0' }}
            py="16"
            px="4"
        >
            <VStack spacing="16" w="100%" className="wrapper">
                <Box textAlign="center">
                    <Center mb="6">
                        <Logo width="40px" height="40px" />
                    </Center>

                    {type === AuthCardType.REDIRECT ? (
                        <Heading fontSize="2xl" mb="2">
                            Log in to start sailing
                        </Heading>
                    ) : (
                        <Heading fontSize="3xl" mb="2">
                            Start Sailing
                        </Heading>
                    )}
                    {type === AuthCardType.SIGNIN || type === AuthCardType.REDIRECT ? (
                        <Text as="span">
                            Not a member yet? <Link onClick={() => navigate(Routes.Public.Register)}>Sign Up</Link>
                        </Text>
                    ) : (
                        <Text as="span">
                            Already a member? <Link onClick={() => navigate(Routes.Public.Auth)}>Sign In</Link>
                        </Text>
                    )}
                </Box>
                <VStack spacing="6" w="100%" className="content">
                    {type === AuthCardType.SIGNIN || type === AuthCardType.REDIRECT ? <SignInForm /> : <SignUpForm />}
                    <TextDivider text="or" />
                    <SocialButtons path={path} mode={type} />
                    <Link>Having trouble?</Link>
                </VStack>
            </VStack>
        </Box>
    );
};
