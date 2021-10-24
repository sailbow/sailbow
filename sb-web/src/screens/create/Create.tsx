import React, { ChangeEvent, FunctionComponent, useState } from 'react';

import { Box, Text, Button, Flex, Heading, Stack } from '@chakra-ui/react';

import { CheckmarkIcon } from 'components/button/ButtonIcons';
import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { Input, TextArea } from 'components/input/Input';
import { Banner } from 'modules/banner/Banner';
import { UserSearch } from 'modules/user-search/UserSearch';

import 'screens/create/Create.scss';

export const Create: FunctionComponent = () => {
    const [, dispatch] = useBoat();
    const [boatForm, setBoatForm] = useState<{ name: string; description: string }>({ name: '', description: '' });

    const onFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBoatForm({
            ...boatForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log(boatForm);
        dispatch({ type: BoatActionType.SetDetails, payload: boatForm });
    };

    return (
        <Flex flexDir="column" className="sb-create container" px={{ base: '4', md: '8' }}>
            <Stack spacing="4">
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                    Start a boat
                </Heading>

                <Stack spacing="6">
                    <Box>
                        <Banner />
                    </Box>
                    <Input
                        label="Name"
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
                        props={{
                            onChange: onFormChange,
                            name: 'description',
                            id: 'description',
                            rows: 3,
                            variant: 'brand',
                            placeholder: 'What is your boat about?',
                        }}
                    />
                    <Stack spacing="4" pt="8">
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
                <Button variant="link" mr="8">
                    Cancel
                </Button>
                <Button onClick={onSubmit} rightIcon={CheckmarkIcon}>
                    <Text>Start Boat</Text>
                </Button>
            </Flex>
        </Flex>
    );
};
