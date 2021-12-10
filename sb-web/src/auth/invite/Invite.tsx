import React, { FunctionComponent, useEffect } from 'react';

import { Button, Heading, Flex, Text } from '@chakra-ui/react';
import { CheckmarkIcon } from 'components/button/ButtonIcons';
import { Http } from 'util/http/Http';
import { AuthEndpoints } from 'util/http/Endpoints';
import { ToastActionType, useToast } from 'modules/toast/Toast';
import { ErrorCode, getErrorPath } from 'util/error/Error';

export const Invite: FunctionComponent = () => {
    const [, dispatch] = useToast();
    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const inviteId: string | null = urlSearchParams.get('inviteId');

            if (!inviteId) {
                window.location.href = getErrorPath(ErrorCode.InviteNotFound);
                return null;
            }

            try {
                const response = await Http(AuthEndpoints.GetInvite());
                console.log(response);
            } catch (err) {
                dispatch({ type: ToastActionType.ShowError, text: 'Invalid invite' });
            }
        })();
    }, [dispatch]);
    return (
        <Flex
            className="container"
            flexDir="column"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            h="100%"
        >
            <Heading>Great! Looks like you are getting ready for your next adventure!</Heading>
            <Text fontWeight="normal" mt="4">
                Someone has invited you to their boat!
            </Text>
            <Button variant="solid" size="lg" mt="16" rightIcon={CheckmarkIcon}>
                <Text>Accept Invite</Text>
            </Button>
        </Flex>
    );
};
