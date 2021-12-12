import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

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

import { useBoat } from 'boats/Boat.Store';
import { BannerState, BannerType, CreateBoat, Crew } from 'boats/Boat.Types';
import { Banner, UserList, UserSearch } from 'boats/components';
import { Steps } from 'boats/create-edit/CreateEdit.Tut';
import { CheckMarkIcon } from 'components/button/ButtonIcons';
import { Input, TextArea } from 'components/input/Input';
import { RoleType } from 'modules/role/Role';
import { Tour } from 'modules/tour/Tour';
import { useProfile } from 'profile/Profile';
import { Routes } from 'router/Router.Types';
import { Color } from 'theme/Colors';
import { SbCloseIcon } from 'util/icons/Icons';

import 'boats/create-edit/CreateEdit.scss';

export const CreateEdit: FunctionComponent = () => {
    const [{ createOpen, loading }, { createBoat, closeCreateBoat }] = useBoat();
    const [{ profile }] = useProfile();
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

    const onSubmit = async () => {
        const boatResponse = await createBoat(boatForm);

        if (boatResponse) {
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
        >
            <DrawerOverlay />
            <DrawerContent w="500px">
                <DrawerHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Heading fontSize="xl">Start a boat</Heading>
                        <Flex>
                            <Tour steps={Steps} />
                            <IconButton
                                onClick={() => closeCreateBoat()}
                                aria-label="close-icon"
                                icon={<SbCloseIcon />}
                                colorScheme="gray"
                                fontSize="xl"
                                variant="ghost"
                            />
                        </Flex>
                    </Flex>
                </DrawerHeader>

                <DrawerBody pb="8">
                    <Stack spacing="4">
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
                                        If you haven’t gone on a voyage with a sailor before, use the link to invite
                                        them!
                                    </Text>
                                </Box>
                                <UserSearch onChange={onAddCrewMember} />
                                <UserList actions crew={boatForm.crew} onDelete={onRemoveCrewMember} />
                            </Stack>
                        </Stack>
                    </Stack>
                </DrawerBody>

                <DrawerFooter>
                    <Box className="create-boat-actions">
                        <Button variant="link" mr="8" onClick={() => closeCreateBoat()}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!boatForm.name}
                            isLoading={loading.create}
                            onClick={onSubmit}
                            rightIcon={CheckMarkIcon}
                        >
                            <Text>Start Boat</Text>
                        </Button>
                    </Box>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        // <Flex flexDir="column" className="sb-create container" px="4">
        //     <Stack spacing="4">
        //         {/* <Flex alignItems="center">
        //             <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" pr="1">
        //                 Start a boat
        //             </Heading>
        //             <Tour steps={Steps} />
        //         </Flex> */}

        //         <Stack spacing="6">
        //             <Banner banner={boatForm.banner} onChange={onBannerChange} />
        //             <Input
        //                 label="Name"
        //                 customClass="create-boat-name"
        //                 required
        //                 props={{
        //                     onChange: onFormDetailsChange,
        //                     fontSize: '3xl',
        //                     placeholder: 'Boat name...',
        //                     fontWeight: 'semibold',
        //                     id: 'name',
        //                     name: 'name',
        //                     py: '7',
        //                     autoFocus: true,
        //                 }}
        //             />
        //             <TextArea
        //                 label="Description"
        //                 customClass="create-boat-description"
        //                 props={{
        //                     onChange: onFormDetailsChange,
        //                     name: 'description',
        //                     id: 'description',
        //                     rows: 3,
        //                     variant: 'brand',
        //                     placeholder: 'What is your boat about?',
        //                 }}
        //             />
        //             <Stack spacing="4" pt="8" className="create-boat-gather-crew">
        //                 <Box>
        //                     <Text fontSize="lg" fontWeight="semibold">
        //                         Gather your crew
        //                     </Text>
        //                     <Text fontWeight="normal" fontSize="sm" color="brand.muted">
        //                         If you haven’t gone on a voyage with a sailor before, use the link to invite them!
        //                     </Text>
        //                 </Box>
        //                 <UserSearch onChange={onAddCrewMember} />
        //                 <UserList actions crew={boatForm.crew} onDelete={onRemoveCrewMember} />
        //             </Stack>
        //         </Stack>
        //     </Stack>
        //     <Flex mt="32" justifyContent="flex-end">
        //         <Box className="create-boat-actions">
        //             <Button variant="link" mr="8">
        //                 Cancel
        //             </Button>
        //             <Button
        //                 disabled={!boatForm.name}
        //                 isLoading={loading.create}
        //                 onClick={onSubmit}
        //                 rightIcon={CheckMarkIcon}
        //             >
        //                 <Text>Start Boat</Text>
        //             </Button>
        //         </Box>
        //     </Flex>
        // </Flex>
    );
};
