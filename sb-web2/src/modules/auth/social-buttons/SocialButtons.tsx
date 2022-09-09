import { FC } from 'react';

import { Box, Button, Text } from '@chakra-ui/react';

import { Provider } from 'modules/auth/Auth.Service';
import { SbFacebookIcon, SbGoogleIcon } from 'shared/icons/Icons';

import { useAuthStore } from '../Auth.Store';

interface Props {
    path?: string;
}

export const SocialButtons: FC<Props> = ({ path }) => {
    const [, { providerLogin }] = useAuthStore();

    const onLogin = async (provider: Provider) => {
        let state = '';
        if (path) {
            state = encodeURI(JSON.stringify({ path }));
        }

        try {
            const url = await providerLogin(provider, state);

            if (url) {
                window.open(url, '_self');
            }
        } catch (err: any) {
            console.log(err.response);
        }
    };

    return (
        <>
            <Button
                w="100%"
                size="lg"
                variant="social"
                colorScheme="gray"
                leftIcon={<SbGoogleIcon />}
                onClick={() => onLogin(Provider.Google)}
            >
                <Text pr="6">Log In with Google</Text>
                <Box />
            </Button>
            <Button
                w="100%"
                size="lg"
                variant="social"
                colorScheme="gray"
                leftIcon={<SbFacebookIcon />}
                onClick={() => onLogin(Provider.Facebook)}
            >
                <Text pr="2">Log In with Facebook</Text>
                <Box />
            </Button>
        </>
    );
};
