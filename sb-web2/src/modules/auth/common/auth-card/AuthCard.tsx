import { FC, ReactNode } from 'react';

import { Box, Center, Heading, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { AuthCardType } from 'modules/auth/Auth.Types';
import { SocialButtons } from 'modules/auth/common/social-buttons/SocialButtons';
import { Logo } from 'shared/icons/Icons';

import './AuthCard.scss';

interface Props {
    path?: string;
    title: string;
    subtitle: ReactNode;
    children: ReactNode;
    showSocialButtons?: boolean;
    type?: AuthCardType;
}

export const AuthCard: FC<Props> = ({ path, title, subtitle, children, showSocialButtons = false, type }) => {
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
            className="sb-auth-card"
        >
            <VStack spacing="16" w="100%" className="wrapper">
                <Box textAlign="center">
                    <Center mb="6">
                        <Logo width="40px" height="40px" />
                    </Center>

                    <Heading fontSize="2xl" mb="2">
                        {title}
                    </Heading>

                    <Text as="span">{subtitle}</Text>
                </Box>
                <VStack spacing="4" w="100%" className="content">
                    {children}
                    {showSocialButtons && (
                        <>
                            <TextDivider text="or" />
                            <SocialButtons path={path} mode={type} />
                        </>
                    )}

                    <Link>Having trouble?</Link>
                </VStack>
            </VStack>
        </Box>
    );
};
