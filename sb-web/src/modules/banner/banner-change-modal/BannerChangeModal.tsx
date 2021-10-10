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
    ModalCloseButton,
    Icon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';

import { BannerType } from 'contexts/boat/BoatConstants';
import { ColorBox } from 'modules/banner/banner-change-modal/color-box/ColorBox';
import { ImageSearch } from 'modules/banner/banner-change-modal/image-search/ImageSearch';

import { BannerColors, Color } from 'theme/Colors';

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
                <ModalHeader>
                    <Heading fontSize="3xl">Change Banner</Heading>
                </ModalHeader>
                <ModalCloseButton mt="5" />

                <ModalBody className="sb-banner-select-modal">
                    <Tabs colorScheme="teal" defaultIndex={banner.type}>
                        <TabList>
                            <Tab fontWeight="semibold">Our Picks</Tab>
                            <Tab fontWeight="semibold">Search Images</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p="0">
                                <Flex d="inline-flex" flexWrap="wrap">
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
                    <Button variant="link" mr={3} onClick={onClose}>
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
