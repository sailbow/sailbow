import React, { FunctionComponent, useEffect, useState } from 'react';

import { Avatar, Box, Button, Heading, Flex, Text, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { CheckMarkIcon } from 'components/button/ButtonIcons';
import { Footer } from 'modules/footer/Footer';
import { ToastActionType, useToast } from 'modules/toast/Toast';
import { ErrorCode, getErrorPath } from 'util/error/Error';
import { Http } from 'util/http/Http';
import { AuthEndpoints } from 'util/http/Endpoints';
import { BannerState } from 'boats/Boat.Types';
import { AxiosResponse } from 'axios';
import { Banner } from 'boats/components';

interface InviteType {
    id: string;
    banner: BannerState;
    boatName: string;
    captain: {
        name: string;
        role: string;
        userId: string;
    };
}

export const Invite: FunctionComponent = () => {
    const [, dispatch] = useToast();
    const { boatId } = useParams<{ boatId: string }>();
    const [invite, setInvite] = useState<InviteType | null>(null);

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const inviteId: string | null = urlSearchParams.get('inviteId');

            if (!inviteId) {
                window.location.href = getErrorPath(ErrorCode.InviteError);
                return null;
            }

            try {
                const { data }: AxiosResponse<InviteType> = await Http(AuthEndpoints.GetInvite(boatId, inviteId));

                if (!data) {
                    throw new Error('No invite found');
                }

                setInvite(data);
            } catch (err: any) {
                console.log(err.status);
                dispatch({ type: ToastActionType.ShowError, text: 'Invalid invite' });
            }
        })();
    }, [dispatch, boatId]);

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
                            <Button variant="solid" size="lg" mt="16" rightIcon={CheckMarkIcon}>
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
