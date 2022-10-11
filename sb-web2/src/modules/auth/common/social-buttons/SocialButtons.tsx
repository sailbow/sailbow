import { FC, useMemo, useState } from 'react';

import { Box, Button, Text } from '@chakra-ui/react';

import { Provider } from 'modules/auth/Auth.Service';
import { SbFacebookIcon, SbGoogleIcon } from 'shared/icons/Icons';

import { useAuthStore } from '../../Auth.Store';
import { AuthCardType } from '../../Auth.Types';

interface Props {
    path?: string;
    mode?: AuthCardType;
}

export const SocialButtons: FC<Props> = ({ path, mode }) => {
    const [, { providerLogin }] = useAuthStore();
    const [loader, setLoader] = useState({
        [Provider.Facebook]: false,
        [Provider.Google]: false,
    });
    const onLogin = async (provider: Provider) => {
        let state = '';
        if (path) {
            state = encodeURI(JSON.stringify({ path }));
        }

        try {
            setLoader((l) => ({ ...l, [provider]: true }));
            const url = await providerLogin(provider, state);

            if (url) {
                setLoader((l) => ({ ...l, [provider]: false }));

                window.open(url, '_self');
            }
        } catch (err: any) {
            console.log(err.response);
        }
    };
    const modeText = useMemo(
        () => (mode === AuthCardType.REDIRECT || mode === AuthCardType.SIGNIN ? 'Log In' : 'Sign Up'),
        [mode],
    );

    return (
        <>
            <Button
                isLoading={loader[Provider.Google]}
                w="100%"
                variant="social"
                colorScheme="gray"
                leftIcon={<SbGoogleIcon />}
                onClick={() => onLogin(Provider.Google)}
            >
                <Text pr="6">{modeText} with Google</Text>
                <Box />
            </Button>
            <Button
                isLoading={loader[Provider.Facebook]}
                w="100%"
                variant="social"
                colorScheme="gray"
                leftIcon={<SbFacebookIcon />}
                onClick={() => onLogin(Provider.Facebook)}
            >
                <Text pr="2">{modeText} with Facebook</Text>
                <Box />
            </Button>
        </>
    );
};
