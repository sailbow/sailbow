import { FC } from 'react';

import { Box, Link, Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbInfoIcon } from 'shared/icons/Icons';
import { BoatBanner } from 'modules/boats/common';
import { Boat } from 'modules/boats/Boat.Types';

interface Props {
    data: Pick<Boat, 'name' | 'banner' | 'description'>;
}

export const Info: FC<Props> = ({ data }) => {
    return (
        <Box w="100%" py="1">
            <Box h={{ base: '260px', md: '200px' }}>
                <BoatBanner id="details" banner={data.banner} showControls={false} />
            </Box>
            <Box pt="4">
                <Text>{data.name}</Text>
                <Text>{data.description}</Text>
                {/* <TextEdit
                    type="heading"
                    fontSize="md"
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
                    mt="1"
                    type="text"
                    fontWeight="normal"
                    color="gray.500"
                    fontSize="sm"
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
                </TextEdit> */}
            </Box>
        </Box>
    );
};

export const InfoManifest: FC<Props> = ({ data }) => {
    return (
        <BoatManifest icon={<SbInfoIcon />} label="Information" action={<Link fontSize="sm">Edit</Link>}>
            <Box w="100%" py="1">
                <Box h={{ base: '260px', md: '200px' }}>
                    <BoatBanner id="details" banner={data.banner} showControls={false} />
                </Box>
                <Box pt="2">
                    <Text fontWeight="semibold">{data.name}</Text>
                    <Text fontSize="sm">{data.description}</Text>
                </Box>
            </Box>
        </BoatManifest>
    );
};
