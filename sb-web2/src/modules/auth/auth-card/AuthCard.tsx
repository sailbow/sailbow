import { FC } from 'react';

import { Box, Heading, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { SignIn } from 'modules/auth/sign-in/SignIn';
import { SocialButtons } from 'modules/auth/social-buttons/SocialButtons';
import { Logo } from 'shared/icons/Icons';

import './AuthCard.scss';

export enum AuthCardType {
    SIGNIN,
    SIGNUP,
}

interface Props {
    path?: string;
    type: AuthCardType;
}

export const AuthCard: FC<Props> = ({ path, type }) => {
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
            p={{ base: '8', md: '12' }}
            borderRadius="xl"
            className="sb-auth-card"
            border={{ base: 'none', md: '2px solid' }}
            borderColor={{ base: 'none', md: 'brand.border-light' }}
            w={{ md: '450px', base: '100%' }}
            maxW="450px"
            mx={{ base: '12px', md: '0' }}
        >
            <VStack spacing="16" w="100%" className="wrapper">
                <Box textAlign="center">
                    <Box mb="4">
                        <Logo width="28px" height="28px" />
                    </Box>
                    <Heading fontSize="3xl" mb="2">
                        Start Sailing
                    </Heading>
                    {type === AuthCardType.SIGNIN ? (
                        <Text as="span">
                            Not a member yet? <Link>Sign Up!</Link>
                        </Text>
                    ) : (
                        <Text as="span">
                            Already a member? <Link>Sign In!</Link>
                        </Text>
                    )}
                </Box>
                <VStack spacing="6" w="100%" className="content">
                    <SignIn />
                    <TextDivider text="or" />
                    <SocialButtons path={path} />
                    <Link>Having trouble?</Link>
                </VStack>
            </VStack>
        </Box>
    );
};
