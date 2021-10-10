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
import { BannerColors, Color } from 'theme/Colors';

import 'modules/banner/banner-select-modal/BannerSelectModal.scss';
import { Checkmark } from 'util/Icons';
import { BannerType } from 'contexts/boat/BoatConstants';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onChange: (type: BannerType, value: string | Color) => void;
    banner: {
        type: BannerType;
        value: string;
    };
}

interface ColorBoxProps {
    color: Color;
    selected?: boolean;
}

export const BannerSelectModal: FunctionComponent<Props> = ({ isOpen, onClose, onChange, banner }) => {
    const ColorBox: FunctionComponent<ColorBoxProps> = ({ color, selected }) => {
        return (
            <Box
                bg={color.toString()}
                borderRadius="lg"
                mr="4"
                my="3"
                className={`color-box ${selected ? 'selected' : ''}`}
                onClick={() => {
                    onChange(BannerType.Color, color.toString());
                }}
            >
                {selected && (
                    <Box className="check">
                        <Checkmark />
                    </Box>
                )}
            </Box>
        );
    };

    ColorBox.defaultProps = {
        selected: false,
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent py="4">
                <ModalHeader>
                    <Heading fontSize="3xl">Change Banner</Heading>
                </ModalHeader>
                <ModalCloseButton mt="5" />

                <ModalBody className="sb-banner-select-modal">
                    <Tabs colorScheme="teal">
                        <TabList>
                            <Tab fontWeight="semibold">Our Picks</Tab>
                            <Tab fontWeight="semibold">Search Images</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Flex d="inline-flex" flexWrap="wrap">
                                    {BannerColors.map((color) => {
                                        return (
                                            <ColorBox
                                                color={color}
                                                key={color.toString()}
                                                selected={color.toString() === banner.value}
                                            />
                                        );
                                    })}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Box>
                                    <Heading size="sm">Unsplash Images</Heading>
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
