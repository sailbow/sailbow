import { FunctionComponent, useState } from 'react';

import { Box, Button, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react';

import { BannerType } from 'modules/boats/Boat.Types';
import { ColorBox } from 'modules/boats/components/banner/banner-change-modal/color-box/ColorBox';
import { ImageSearch } from 'modules/boats/components/banner/banner-change-modal/image-search/ImageSearch';
import { SbCheckMarkIcon } from 'shared/icons/Icons';
import { Modal } from 'shared/modal/Modal';
import { BannerColors, Color } from 'theme/colors/Colors';

import './BannerChangeModal.scss';

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
    const [bannerForm, setBannerForm] = useState<{ type: BannerType; value: string }>({ ...banner });

    const onSubmit = () => {
        onChange(bannerForm.type, bannerForm.value);
        onClose();
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            positiveButton={
                <Button onClick={onSubmit} rightIcon={SbCheckMarkIcon} mt="4">
                    <Text>Done</Text>
                </Button>
            }
            title="Change Banner"
            bodyClass="sb-cover-select-modal"
        >
            <Tabs colorScheme="teal">
                <TabList>
                    <Tab fontWeight="semibold">Our Picks</Tab>
                    <Tab fontWeight="semibold">Search Images</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p="0">
                        <Flex display="inline-flex" flexWrap="wrap" mt="4">
                            {BannerColors.map((color) => {
                                return (
                                    <ColorBox
                                        color={color}
                                        key={color.toString()}
                                        selected={color.toString() === bannerForm.value}
                                        onChange={(type, value) => setBannerForm({ type, value })}
                                    />
                                );
                            })}
                        </Flex>
                    </TabPanel>
                    <TabPanel p="0">
                        <Box pt="4">
                            <ImageSearch onChange={(type, value) => setBannerForm({ type, value })} />
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Modal>
    );
};
