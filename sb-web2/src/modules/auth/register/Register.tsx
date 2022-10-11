import { FC } from 'react';

import { Flex } from '@chakra-ui/react';

import { AuthCard, AuthCardType } from 'modules/auth/auth-card/AuthCard';
import { NavbarHeight } from 'theme';

export const Register: FC = () => {
    return (
        <Flex className="sb-login" w="100%" justifyContent="center" pt={{ base: 0, md: NavbarHeight }}>
            <AuthCard type={AuthCardType.SIGNUP} />
        </Flex>
    );
};
