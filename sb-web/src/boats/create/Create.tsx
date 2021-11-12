import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { Box, Text, Button, Flex, Heading, Stack } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'boats/Boat.Store';
import { Banner } from 'boats/banner/Banner';
import { Steps } from 'boats/create/Create.Tut';
import { CheckmarkIcon } from 'components/button/ButtonIcons';
import { Input, TextArea } from 'components/input/Input';
import { Role } from 'components/role/Role';
import { Tour } from 'modules/tour/Tour';
import { UserSearch } from 'modules/user-search/UserSearch';
import { useProfile } from 'profile/Profile';

import 'boats/create/Create.scss';

export const Create: FunctionComponent = () => {
    const [, dispatch] = useBoat();
    const [{ profile }] = useProfile();
    const [boatForm, setBoatForm] = useState<{ name: string; description: string }>({ name: '', description: '' });

    useEffect(() => {
        if (profile) {
            dispatch({
                type: BoatActionType.AddCrew,
                payload: {
                    crew: { name: profile.name, email: profile.email, role: Role.Captain, info: '' },
                },
            });
        }
    }, [profile, dispatch]);

    const onFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBoatForm({
            ...boatForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log(boatForm);
        dispatch({ type: BoatActionType.SetDetails, payload: { ...boatForm } });
    };

    return (
        <>
            <Flex flexDir="column" className="sb-create container" px={{ base: '4', md: '8' }}>
                <Stack spacing="4">
                    <Flex alignItems="center">
                        <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" pr="1">
                            Start a boat
                        </Heading>
                        <Tour steps={Steps} />
                    </Flex>

                    <Stack spacing="6">
                        <Banner />
                        <Input
                            label="Name"
                            customClass="create-boat-name"
                            required
                            props={{
                                onChange: onFormChange,
                                fontSize: '3xl',
                                placeholder: 'Boat name...',
                                fontWeight: 'semibold',
                                id: 'name',
                                name: 'name',
                                py: '7',
                                autoFocus: true,
                            }}
                        />
                        <TextArea
                            label="Description"
                            customClass="create-boat-description"
                            props={{
                                onChange: onFormChange,
                                name: 'description',
                                id: 'description',
                                rows: 3,
                                variant: 'brand',
                                placeholder: 'What is your boat about?',
                            }}
                        />
                        <Stack spacing="4" pt="8" className="create-boat-gather-crew">
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Gather your crew
                                </Text>
                                <Text fontWeight="normal" fontSize="sm" color="brand.muted">
                                    If you haven’t gone on a voyage with a sailor before, use the link to invite them!
                                </Text>
                            </Box>
                            <UserSearch />
                        </Stack>
                    </Stack>
                </Stack>
                <Flex mt="32" justifyContent="flex-end">
                    <Box className="create-boat-actions">
                        <Button variant="link" mr="8">
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} rightIcon={CheckmarkIcon}>
                            <Text>Start Boat</Text>
                        </Button>
                    </Box>
                </Flex>
            </Flex>
        </>
    );
};
