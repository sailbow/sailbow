import { FunctionComponent } from 'react';

import { Box, Button, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react';

import { Modal } from 'shared/modal/Modal';
import { BannerType } from 'modules/boats/Boat.Types';
import { ColorBox } from 'modules/boats/components/banner/banner-change-modal/color-box/ColorBox';
import { ImageSearch } from 'modules/boats/components/banner/banner-change-modal/image-search/ImageSearch';
import { BannerColors, Color } from 'theme/colors/Colors';

import './BannerChangeModal.scss';
import { SbCheckMarkIcon } from 'shared/icons/Icons';

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            positiveButton={
                <Button onClick={onClose} rightIcon={SbCheckMarkIcon} mt="4">
                    <Text>Done</Text>
                </Button>
            }
            title="Change Banner"
            bodyClass="sb-cover-select-modal"
        >
            <Tabs colorScheme='teal'>
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
        </Modal>
    );
};
