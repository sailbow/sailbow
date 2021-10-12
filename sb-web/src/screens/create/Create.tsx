import React, { ChangeEvent, FunctionComponent, useState } from 'react';

import { Box, Text, Button, Flex, Heading, Stack, Divider } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { Input, TextArea } from 'components/input/Input';
import { Banner } from 'modules/banner/Banner';
import { UserSearch } from 'modules/user-search/UserSearch';
import { Boat, ChatRight, Checkmark } from 'util/Icons';

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

                <Stack spacing="2">
                    <Box pb="4">
                        <Banner />
                    </Box>
                    <Input
                        icon={<Boat />}
                        props={{
                            onChange: onFormChange,
                            fontSize: '4xl',
                            placeholder: 'Boat name...',
                            fontWeight: 'semibold',
                            id: 'name',
                            name: 'name',
                            py: '8',
                            autoFocus: true,
                        }}
                    />
                    <TextArea
                        icon={<ChatRight />}
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
                            <Heading fontSize="xl">Gather your crew</Heading>
                            <Text fontWeight="normal" fontSize="sm" color="brand.muted">
                                If you haven’t gone on a voyage with a sailor before, use the link to invite them!
                            </Text>
                        </Box>
                        <UserSearch />
                        <Divider />
                    </Stack>
                </Stack>
            </Stack>
            <Flex mt="8" justifyContent="flex-end">
                <Button variant="link" mr="8">
                    Cancel
                </Button>
                <Button onClick={onSubmit} isFullWidth={false} rightIcon={<Checkmark />}>
                    <Text pr="6">Submit</Text>
                </Button>
            </Flex>
        </Flex>
    );
};
