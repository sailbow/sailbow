import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { Box, Text, Button, Flex, Heading, Stack } from '@chakra-ui/react';

import { initialBoatState, useBoat } from 'boats/Boat.Store';
import { Banner } from 'boats/banner/Banner';
import { Steps } from 'boats/create/Create.Tut';
import { CheckmarkIcon } from 'components/button/ButtonIcons';
import { Input, TextArea } from 'components/input/Input';
import { RoleType } from 'modules/role/Role';
import { Tour } from 'modules/tour/Tour';
import { UserList } from 'boats/components/user-list/UserList';
import { UserSearch } from 'boats/components/user-search/UserSearch';
import { useProfile } from 'profile/Profile';

import 'boats/create/Create.scss';
import { BannerState, BoatState, Crew } from 'boats/Boat.Types';

export const Create: FunctionComponent = () => {
    const [, { createBoat }] = useBoat();
    const [{ profile }] = useProfile();
    const [boatForm, setBoatForm] = useState<BoatState>(initialBoatState);

    useEffect(() => {
        if (profile) {
            setBoatForm({
                ...boatForm,
                crew: [{ name: profile.name, email: profile.email, role: RoleType.Captain, info: '' }],
            });
        }
    }, [profile]); // eslint-disable-line

    const onAddCrewMember = (crew: Crew) => {
        setBoatForm({
            ...boatForm,
            crew: [...boatForm.crew, { ...crew }],
        });
    };

    const onRemoveCrewMember = (email: string) => {
        const updatedCrewList = boatForm.crew.filter((crew: Crew) => crew.email !== email);
        setBoatForm({
            ...boatForm,
            crew: [...updatedCrewList],
        });
    };

    const onFormDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBoatForm({
            ...boatForm,
            [e.target.name]: e.target.value,
        });
    };

    const onBannerChange = (banner: BannerState) => {
        setBoatForm({ ...boatForm, banner });
    };

    const onSubmit = () => {
        console.log(boatForm);
        createBoat(boatForm);
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
                        <Banner banner={boatForm.banner} onChange={onBannerChange} />
                        <Input
                            label="Name"
                            customClass="create-boat-name"
                            required
                            props={{
                                onChange: onFormDetailsChange,
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
                                onChange: onFormDetailsChange,
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
                            <UserSearch onChange={onAddCrewMember} />
                            <UserList actions crew={boatForm.crew} onDelete={onRemoveCrewMember} />
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
