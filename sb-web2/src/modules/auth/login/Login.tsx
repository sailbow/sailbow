import { FC } from 'react';

import { Flex } from '@chakra-ui/react';

import { AuthCard, AuthCardType } from 'modules/auth/auth-card/AuthCard';

export const Login: FC = () => {
    return (
        <Flex className="sb-landing" h="100%" w="100%" justifyContent="center" alignItems="center">
            <AuthCard type={AuthCardType.SIGNIN} />
        </Flex>
    );
};
