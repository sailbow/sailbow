import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Heading, Flex, Text, Spinner } from '@chakra-ui/react';

import { acceptInvite, getInvite, InviteType } from 'auth/invite/Invite.Service';
import { Banner } from 'boats/components';
import { CheckMarkIcon } from 'components/button/ButtonIcons';
import { Footer } from 'modules/footer/Footer';
import { ToastActionType, useToast } from 'modules/toast/Toast';
import { Routes } from 'router/Router.Types';
import { ErrorCode, getErrorPath } from 'util/error/Error';
import { HttpStatus } from 'util/http/Http';

export const Invite: FunctionComponent = () => {
    const [, dispatch] = useToast();
    const boatId: string | null = new URLSearchParams(window.location.search).get('boatId');
    const inviteId: string | null = new URLSearchParams(window.location.search).get('inviteId');
    const [invite, setInvite] = useState<InviteType | null>(null);

    useEffect(() => {
        (async () => {
            if (!inviteId || !boatId) {
                window.location.href = getErrorPath(ErrorCode.InviteError);
                return null;
            }

            try {
                const data = await getInvite(boatId, inviteId);

                if (!data) {
                    throw new Error('No invite found');
                }

                setInvite(data);
            } catch (error: any) {
                switch (error.response.status) {
                    case HttpStatus.NOT_FOUND:
                        window.location.href = getErrorPath(ErrorCode.InviteNotFound);
                        break;
                    case 409:
                        window.location.href = getErrorPath(ErrorCode.InviteConflict);
                        break;
                    case HttpStatus.FORBIDDEN:
                        window.location.href = getErrorPath(ErrorCode.InviteForbidden);
                        break;
                    default:
                        window.location.href = getErrorPath(ErrorCode.InviteError);
                }
                dispatch({ type: ToastActionType.ShowError, text: 'Invalid invite' });
            }
        })();
    }, [dispatch, boatId, inviteId]);

    const onAccept = async () => {
        try {
            const data = await acceptInvite(boatId!, inviteId!);

            window.location.href = `${Routes.Private.Boats}/${data.id}`;
        } catch (err: any) {
            console.log(err.response);
            dispatch({ type: ToastActionType.ShowError, text: 'Invalid invite' });
        }
    };

    return (
        <>
            <Flex className="container" flexDir="column" textAlign="center" pt="16" pb="48">
                {invite ? (
                    <>
                        <Heading>You have been invited!</Heading>
                        <Box mt="4" fontWeight="normal">
                            <Banner showControls={false} banner={invite.banner} />
                            <Text fontWeight="normal" mt="4">
                                <Text as="span" fontWeight="semibold">
                                    {invite.captain.role} {invite.captain.name}
                                </Text>{' '}
                                has invited you to their boat,{' '}
                                <Text as="span" fontWeight="semibold">
                                    {invite.boatName}
                                </Text>
                                !
                            </Text>
                            <Button variant="solid" size="lg" mt="16" rightIcon={CheckMarkIcon} onClick={onAccept}>
                                <Text>Accept Invite</Text>
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Spinner />
                )}
            </Flex>

            <Footer />
        </>
    );
};
