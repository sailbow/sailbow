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
    Stack,
} from '@chakra-ui/react';
import { BannerColors, Color } from 'theme/Colors';

import 'modules/banner/banner-select-modal/BannerSelectModal.scss';
import { Checkmark } from 'util/Icons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onChange: (value: string | Color) => void;
    current: string | Color;
}

interface ColorBoxProps {
    color: Color;
    selected?: boolean;
}

export const BannerSelectModal: FunctionComponent<Props> = ({ isOpen, onClose, onChange, current }) => {
    const ColorBox: FunctionComponent<ColorBoxProps> = ({ color, selected }) => {
        return (
            <Box
                bg={color.toString()}
                borderRadius="lg"
                mr="4"
                my="3"
                className={`color-box ${selected ? 'selected' : ''}`}
                onClick={() => {
                    onChange(color as Color);
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
                <ModalHeader>Change Banner</ModalHeader>
                <ModalCloseButton mt="5" />

                <ModalBody className="sb-banner-select-modal">
                    <Stack spacing="6">
                        <Box>
                            <Heading size="sm">Our Picks</Heading>
                            <Flex d="inline-flex" flexWrap="wrap">
                                {BannerColors.map((color) => {
                                    return (
                                        <ColorBox
                                            color={color}
                                            key={color.toString()}
                                            selected={color.toString() === current}
                                        />
                                    );
                                })}
                            </Flex>
                        </Box>
                        <Box>
                            <Heading size="sm">Unsplash Images</Heading>
                        </Box>
                    </Stack>
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
