import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { Box, Text, Button, Stack } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { useBoat } from 'modules/boats/Boat.Store';
import { BannerState, BannerType, CreateBoat, Crew, EditBoat, Role } from 'modules/boats/Boat.Types';
import { BoatBanner, UserList, UserSearch } from 'modules/boats/common';
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
        if (activeBoat && createNavMode === CreateNavMode.Edit) {
            setBoatForm({
                ...boatForm,
                id: activeBoat.id,
                name: activeBoat.name,
                description: activeBoat.description,
                banner: activeBoat.banner,
                crew: activeBoat.crew,
            });
        } else if (user && createNavMode === CreateNavMode.Create) {
            setBoatForm({
                ...boatForm,
                crew: [{ name: user.name, email: user.email, role: Role.Captain, info: '', id: user.id }],
            });
        }
    }, [activeBoat, createNavMode, user]); // eslint-disable-line

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

    const onSubmit = async () => {
        const boatResponse = await createBoat(boatForm);

        if (boatResponse) {
            closeCreateNav();
            window.location.href = `${Routes.Private.Boats}/${boatResponse.id}`;
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
                        <Text>{createNavMode === CreateNavMode.Create ? 'Start Boat' : 'Edit Boat'}</Text>
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
                    py="4"
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
                        rows={3}
                        variant="brand"
                        placeholder="What is your boat about?"
                        maxLength={300}
                        value={boatForm.description}
                    />
                    <Text fontWeight="normal" textAlign="right" fontSize="xs">
                        {boatForm.description?.length}/300
                    </Text>
                </Box>
                <Box className="create-boat-gather-crew">
                    <Text fontSize="sm" fontWeight="semibold" color="brand.secondary" pb="1">
                        Invite Crew
                    </Text>

                    <UserSearch onChange={onAddCrewMember} />

                    <Box mt="4">
                        <UserList actions crew={boatForm.crew} onDelete={onRemoveCrewMember} />
                    </Box>
                </Box>
            </Stack>
        </Drawer>
    );
};
