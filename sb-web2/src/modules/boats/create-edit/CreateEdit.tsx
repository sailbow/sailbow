import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import {
    Box,
    Text,
    Button,
    Flex,
    Heading,
    Stack,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    IconButton,
} from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { useBoat } from 'modules/boats/Boat.Store';
import { BannerState, BannerType, CreateBoat, Crew, Role } from 'modules/boats/Boat.Types';
import { Banner, UserList, UserSearch } from 'modules/boats/components';
import { Input, TextArea } from 'shared/input/Input';
import { Routes } from 'router/Router.Types';
import { Color } from 'theme/colors/Colors';
import { SbCheckMarkIcon, SbCloseIcon } from 'shared/icons/Icons';

import './CreateEdit.scss';

export const CreateEdit: FunctionComponent = () => {
    const [{ createOpen, loading }, { createBoat, closeCreateBoat }] = useBoat();
    const [{ user }] = useAuthStore();
    const [boatForm, setBoatForm] = useState<CreateBoat>({
        name: '',
        description: '',
        banner: {
            type: BannerType.Color,
            value: Color.Orange100,
            position: 50,
        },
        crew: [],
    });

    useEffect(() => {
        if (user) {
            setBoatForm({
                ...boatForm,
                crew: [{ name: user.name, email: user.email, role: Role.Captain, info: '', id: user.id }],
            });
        }
    }, [user]); // eslint-disable-line

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
            closeCreateBoat();
            window.location.href = `${Routes.Private.Boats}/${boatResponse.id}`;
        }
    };

    return (
        <Drawer
            isOpen={createOpen}
            placement="right"
            onClose={() => {
                closeCreateBoat();
            }}
            size="md"
            allowPinchZoom
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Heading fontSize="2xl">Start a Boat</Heading>
                        <Flex>
                            <IconButton
                                mr="-3"
                                onClick={() => closeCreateBoat()}
                                aria-label="close-icon"
                                icon={<SbCloseIcon />}
                                colorScheme="gray"
                                fontSize="2xl"
                                variant="ghost"
                            />
                        </Flex>
                    </Flex>
                </DrawerHeader>

                <DrawerBody pb="8">
                    <Stack spacing="6">
                        <Box height={{ base: '200px', md: '260px' }} className="banner">
                            <Banner id="create" banner={boatForm.banner} onChange={onBannerChange} />
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
                </DrawerBody>

                <DrawerFooter>
                    <Box className="create-boat-actions">
                        <Button variant="menu-link" mr="4" onClick={() => closeCreateBoat()}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!boatForm.name}
                            isLoading={loading.create}
                            onClick={onSubmit}
                            rightIcon={SbCheckMarkIcon}
                            size="lg"
                        >
                            <Text>Start Boat</Text>
                        </Button>
                    </Box>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
