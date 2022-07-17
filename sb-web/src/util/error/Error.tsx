import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Flex, Text, Heading, Link } from '@chakra-ui/react';

import { Footer } from 'shared/footer/Footer';
import { Routes } from 'router/Router.Types';
import { SbRightArrowIcon } from 'util/icons/Icons';

/**
 * 0 - Not found
 * 1 - Forbidden
 * 2 - Error
 * 3 - Conflict
 */
interface ErrorState {
    text: string;
    heading: string;
}

export enum ErrorCode {
    InviteNotFound = 'SBE1000',
    InviteForbidden = 'SBE1001',
    InviteError = 'SBE1002',
    InviteConflict = 'SBE1003',
    BoatNotFound = 'SBE1100',
    BoatForbidden = 'SBE1101',
    BoatError = 'SBE1102',
}

const ErrorDetails: Record<ErrorCode, ErrorState> = {
    [ErrorCode.InviteNotFound]: {
        heading: 'Invite not found! :(',
        text: 'The invite that you are looking for could not be found.',
    },
    [ErrorCode.InviteForbidden]: {
        heading: 'Stop! No access',
        text: 'Unfortunately you do not have access to this invite.',
    },
    [ErrorCode.InviteError]: {
        heading: 'Invalid Invite!',
        text: 'The invite that you are looking for is invalid. Please check the invite link in your email or contact your Captain.',
    },
    [ErrorCode.InviteConflict]: {
        heading: "Oops, you've come to the wrong place",
        text: 'Looks like you are already a part of the boat.',
    },
    [ErrorCode.BoatNotFound]: {
        heading: 'Boat not found!',
        text: 'Looks like the boat you are looking for does not exist.',
    },
    [ErrorCode.BoatForbidden]: {
        heading: 'Stop! No access!',
        text: 'Unfortunately you do not have access to this boat.',
    },
    [ErrorCode.BoatError]: {
        heading: "Oops, something ain't right...",
        text: 'Looks like something went wrong. Please refresh the page or try again later.',
    },
};

export const getErrorPath = (code: string): string => {
    return `${Routes.Private.Error}?code=${code}`;
};

export const Error: FunctionComponent = () => {
    const [errorState, setErrorState] = useState<ErrorState>({
        text: '',
        heading: '',
    });

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const errorCode: string | null = urlSearchParams.get('code');

        switch (errorCode) {
            case ErrorCode.InviteNotFound:
                setErrorState(ErrorDetails[ErrorCode.InviteNotFound]);
                break;
            case ErrorCode.BoatNotFound:
                setErrorState(ErrorDetails[ErrorCode.BoatNotFound]);
                break;
            default:
                setErrorState({
                    heading: 'Oops!',
                    text: 'Looks like something went wrong! :(',
                });
        }
    }, []);

    const onHomeRoute = (): void => {
        window.location.href = Routes.Private.Boats;
    };

    return (
        <>
            <Flex justifyContent="center" alignItems="center" w="100%" py="48" px="4">
                <Box textAlign="center">
                    <Heading>{errorState.heading}</Heading>
                    <Text pt="2" fontWeight="normal">
                        {errorState.text}
                    </Text>
                    <Box pt="16">
                        <Flex alignItems="center" justifyContent="center">
                            <Button rightIcon={<SbRightArrowIcon />} onClick={onHomeRoute}>
                                <Text>Back to Home</Text>
                            </Button>
                        </Flex>
                        <Text fontSize="sm" pt="16">
                            Please contact us{' '}
                            <Link color="brand.dark" href={Routes.Whitelisted.Contact}>
                                here
                            </Link>{' '}
                            if the problem persists.
                        </Text>
                    </Box>
                </Box>
            </Flex>
            <Footer />
        </>
    );
};
