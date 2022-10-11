import { FC, useState, ChangeEvent } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { Banner } from 'modules/boats/components';
import { TextEdit } from 'shared/text-edit/TextEdit';
import { SbInfoIcon } from 'shared/icons/Icons';
import { Input, TextArea } from 'shared/input/Input';

import { BoatDetailsItem } from '../boat-details-item/BoatDetailsItem';

interface Props {
    boat: Boat;
}

export const BoatInfo: FC<Props> = ({ boat }) => {
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
        <Box w="100%">
            <Box h={{ base: '260px', md: '200px' }}>
                <Banner id="details" banner={boat.banner} />
            </Box>
            <Box pt="4">
                <TextEdit
                    px="2"
                    fontSize="lg"
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
                    placeholder="Add a description..."
                    onSave={onSave}
                    onCancel={() => onCancel('description')}
                    editElement={
                        <>
                            <TextArea
                                label={boatForm.description ? 'Edit Description' : 'Add Description'}
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
                    {boat.description || 'Add a description...'}
                </TextEdit>
            </Box>
        </Box>
    );
};

export const BoatDetailsInfo: FC<Props> = ({ boat }) => {
    return (
        <BoatDetailsItem icon={<SbInfoIcon />} label="Information">
            <BoatInfo boat={boat} />
        </BoatDetailsItem>
    );
};
