import React, { ChangeEvent, FunctionComponent, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { Banner } from 'modules/boats/components';
import { TextEdit } from 'shared/text-edit/TextEdit';
import { Input, TextArea } from 'shared/input/Input';

interface Props {
    boat: Boat;
}

export const Details: FunctionComponent<Props> = ({ boat }) => {
    const [boatForm, setBoatForm] = useState<{ name: string; description?: string }>({
        name: boat.name,
        description: boat.description,
    });
    const onFormDetailsChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBoatForm({
            ...boatForm,
            [e.target.name]: e.target.value,
        });
    };

    const onCancel = (param: 'name' | 'description') => {
        setBoatForm({
            ...boatForm,
            [param]: boat[param],
        });
    };

    const onSave = async () => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                rej(boatForm);
            }, 2000);
        });
    };

    return (
        <Box flex="0.2" display={{ base: 'none', md: 'block' }}>
            <Box px="2">
                <Banner id="details" banner={boat.banner} showControls={false} />
            </Box>
            <Box pt="4">
                <TextEdit
                    px="2"
                    fontSize="xl"
                    type="heading"
                    editable
                    onSave={onSave}
                    onCancel={() => onCancel('name')}
                    editElement={
                        <Input
                            label="Edit Name"
                            customClass="create-boat-name"
                            required
                            onChange={onFormDetailsChange}
                            fontSize="xl"
                            placeholder="Boat name..."
                            fontWeight="semibold"
                            id="name"
                            name="name"
                            py="4"
                            defaultValue={boatForm.name}
                        />
                    }
                >
                    {boat.name}
                </TextEdit>
                <TextEdit
                    px="2"
                    mt="2"
                    type="text"
                    fontWeight="normal"
                    color="gray.500"
                    editable
                    onSave={onSave}
                    onCancel={() => onCancel('description')}
                    editElement={
                        <>
                            <TextArea
                                label="Edit Description"
                                customClass="create-boat-description"
                                onChange={onFormDetailsChange}
                                name="description"
                                id="description"
                                rows={5}
                                variant="brand"
                                placeholder="What is your boat about?"
                                maxLength={300}
                                defaultValue={boatForm.description}
                            />
                            <Text fontWeight="normal" textAlign="right" fontSize="xs">
                                {boatForm.description?.length}/300
                            </Text>
                        </>
                    }
                >
                    {boat.description}
                </TextEdit>
            </Box>
        </Box>
    );
};
