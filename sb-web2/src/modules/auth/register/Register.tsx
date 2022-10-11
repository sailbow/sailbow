import { FC } from 'react';

import { Flex } from '@chakra-ui/react';

import { AuthCard } from 'modules/auth/auth-card/AuthCard';
import { NavbarHeight } from 'theme';

import { AuthCardType } from '../Auth.Types';

export const Register: FC = () => {
    return (
        <Flex className="sb-login" w="100%" justifyContent="center" pt={{ base: 0, md: NavbarHeight }}>
            <AuthCard type={AuthCardType.SIGNUP} />
        </Flex>
    );
};
