import React, { FunctionComponent } from 'react';

import {
    Box,
    Button,
    Flex,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    Text,
} from '@chakra-ui/react';

import { BannerType } from 'contexts/boat/BoatConstants';
import { ColorBox } from 'modules/banner/banner-change-modal/color-box/ColorBox';
import { ImageSearch } from 'modules/banner/banner-change-modal/image-search/ImageSearch';
import { BannerColors, Color } from 'theme/Colors';
import { Checkmark, Close } from 'util/Icons';

import 'modules/banner/banner-change-modal/BannerChangeModal.scss';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onChange: (type: BannerType, value: string | Color) => void;
    banner: {
        type: BannerType;
        value: string;
    };
}

export const BannerChangeModal: FunctionComponent<Props> = ({ isOpen, onClose, onChange, banner }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent py="4">
                <ModalHeader d="flex" justifyContent="space-between" alignItems="center">
                    <Heading fontSize="3xl">Change Banner</Heading>
                    <IconButton
                        aria-label="modal-close"
                        variant="ghost"
                        colorScheme="gray"
                        fontSize="xl"
                        onClick={onClose}
                    >
                        <Close />
                    </IconButton>
                </ModalHeader>

                <ModalBody className="sb-banner-select-modal">
                    <Tabs colorScheme="teal">
                        <TabList>
                            <Tab fontWeight="semibold">Our Picks</Tab>
                            <Tab fontWeight="semibold">Search Images</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p="0">
                                <Flex d="inline-flex" flexWrap="wrap" mt="4">
                                    {BannerColors.map((color) => {
                                        return (
                                            <ColorBox
                                                color={color}
                                                key={color.toString()}
                                                selected={color.toString() === banner.value}
                                                onChange={onChange}
                                            />
                                        );
                                    })}
                                </Flex>
                            </TabPanel>
                            <TabPanel p="0">
                                <Box pt="4">
                                    <ImageSearch onChange={onChange} />
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} rightIcon={<Checkmark />} mt="4">
                        <Text pr="4">Done</Text>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
