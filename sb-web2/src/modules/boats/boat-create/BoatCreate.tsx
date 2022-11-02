import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { Box, Text, Button, Stack } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { useBoat } from 'modules/boats/Boat.Store';
import { BannerState, BannerType, CreateBoat, EditBoat, Role } from 'modules/boats/Boat.Types';
import { BoatBanner } from 'modules/boats/common';
import { useSystem } from 'modules/system/System.Store';
import { CreateNavMode } from 'modules/system/System.Types';
import { Input, TextArea } from 'shared/input/Input';
import { Routes } from 'router/Router.Types';
import { Color } from 'theme/colors/Colors';
import { Drawer } from 'shared/drawer/Drawer';
import { SbCheckMarkIcon } from 'shared/icons/Icons';

import './BoatCreate.scss';

const initialForm = {
    name: '',
    description: '',
    banner: {
        type: BannerType.Color,
        value: Color.Orange100,
        position: 50,
    },
    crew: [],
    role: Role.Captain,
};

export const BoatCreate: FunctionComponent = () => {
    const [{ loading, activeBoat }, { createBoat }] = useBoat();
    const [{ createNavMode, createNavOpen }, { closeCreateNav }] = useSystem();
    const [{ user }] = useAuthStore();
    const [boatForm, setBoatForm] = useState<CreateBoat | EditBoat>(initialForm);

    useEffect(() => {
        if (!createNavOpen) {
            setBoatForm(initialForm);
        }
    }, [createNavOpen]);

    useEffect(() => {
        if (activeBoat && createNavMode === CreateNavMode.Edit && createNavOpen) {
            setBoatForm({
                ...boatForm,
                id: activeBoat.id,
                name: activeBoat.name,
                description: activeBoat.description,
                banner: activeBoat.banner,
                crew: activeBoat.crew,
            });
        } else if (user && createNavMode === CreateNavMode.Create && createNavOpen) {
            setBoatForm({
                ...boatForm,
                crew: [{ name: user.name, email: user.email, role: Role.Captain, info: '', id: user.id }],
                captain: { name: user.name, email: user.email, role: Role.Captain, info: '', id: user.id },
            });
        }
    }, [activeBoat, createNavMode, user, createNavOpen]); // eslint-disable-line

    const onFormDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBoatForm({
            ...boatForm,
            [e.target.name]: e.target.value,
        });
    };

    const onBannerChange = (banner: BannerState) => {
        setBoatForm({ ...boatForm, banner });
    };

    const onSubmit = async () => {
        if (createNavMode === CreateNavMode.Create) {
            const boatResponse = await createBoat(boatForm);

            if (boatResponse) {
                closeCreateNav();
                window.location.href = `${Routes.Private.Boats}/${boatResponse.id}`;
            }
        } else {
            // edit boat goast here
        }
    };

    return (
        <Drawer
            title={createNavMode === CreateNavMode.Create ? 'Start a Boat' : 'Edit Boat'}
            isOpen={createNavOpen}
            onClose={closeCreateNav}
            placement="right"
            size="md"
            allowPinchZoom
            footer={
                <Box className="create-boat-actions">
                    <Button variant="menu-link" mr="4" onClick={() => closeCreateNav()}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!boatForm.name}
                        isLoading={loading.create}
                        onClick={onSubmit}
                        rightIcon={SbCheckMarkIcon}
                    >
                        <Text>{createNavMode === CreateNavMode.Create ? 'Start Boat' : 'Save'}</Text>
                    </Button>
                </Box>
            }
        >
            <Stack spacing="6">
                <Box height={{ base: '200px', md: '260px' }} className="banner">
                    <BoatBanner id="create" banner={boatForm.banner} onChange={onBannerChange} showControls />
                </Box>
                <Input
                    label="Name"
                    customClass="create-boat-name"
                    required
                    onChange={onFormDetailsChange}
                    placeholder="Boat name..."
                    id="name"
                    name="name"
                    autoFocus
                    value={boatForm.name}
                />
                <Box>
                    <TextArea
                        label="Description"
                        customClass="create-boat-description"
                        onChange={onFormDetailsChange}
                        name="description"
                        id="description"
                        rows={5}
                        placeholder="What is your boat about?"
                        maxLength={300}
                        value={boatForm.description}
                    />
                    <Text fontWeight="normal" textAlign="right" fontSize="xs">
                        {boatForm.description?.length}/300
                    </Text>
                </Box>
            </Stack>
        </Drawer>
    );
};
