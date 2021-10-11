import React, { ChangeEvent, FunctionComponent, useState } from 'react';

import { Button, Flex, Heading, Stack } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { Input, TextArea } from 'components/input/Input';
import { Banner } from 'modules/banner/Banner';
import { Boat, ChatRight } from 'util/Icons';

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
                    <Banner />
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
                            rows: 4,
                            variant: 'brand',
                            placeholder: 'What is your boat about?',
                        }}
                    />
                </Stack>
                <Button onClick={onSubmit}>Submit</Button>
            </Stack>
        </Flex>
    );
};
