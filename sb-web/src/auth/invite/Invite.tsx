import React, { FunctionComponent, useEffect } from 'react';

import { Avatar, Box, Button, Heading, Flex, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { CheckMarkIcon } from 'components/button/ButtonIcons';
import { Footer } from 'modules/footer/Footer';
import { ToastActionType, useToast } from 'modules/toast/Toast';
import { ErrorCode, getErrorPath } from 'util/error/Error';
import { Http } from 'util/http/Http';
import { AuthEndpoints } from 'util/http/Endpoints';

export const Invite: FunctionComponent = () => {
    const [, dispatch] = useToast();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const inviteId: string | null = urlSearchParams.get('inviteId');

            if (!inviteId) {
                window.location.href = getErrorPath(ErrorCode.InviteNotFound);
                return null;
            }

            try {
                const response = await Http(AuthEndpoints.GetInvite(boatId, inviteId));
                console.log(response);
            } catch (err) {
                dispatch({ type: ToastActionType.ShowError, text: 'Invalid invite' });
            }
        })();
    }, [dispatch, boatId]);

    return (
        <>
            <Flex className="container" flexDir="column" textAlign="center" pt="16" pb="48">
                <Heading>You have been invited!</Heading>
                <Box mt="8" fontWeight="normal">
                    <Avatar name="Hello" size="2xl" />
                    <Text fontWeight="normal" mt="4">
                        Someone has invited you to their boat!
                    </Text>
                    <Button variant="solid" size="lg" mt="16" rightIcon={CheckMarkIcon}>
                        <Text>Accept Invite</Text>
                    </Button>
                </Box>
            </Flex>
            <Footer />
        </>
    );
};
