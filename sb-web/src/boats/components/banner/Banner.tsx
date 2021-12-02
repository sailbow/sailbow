import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button, IconButton } from '@chakra-ui/react';

import { BannerState, BannerType } from 'boats/Boat.Types';
import { BannerChangeModal } from 'boats/components/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/Colors';
import { SbArrowDownIcon, SbArrowUpIcon } from 'util/icons/Icons';

import 'boats/components/banner/Banner.scss';

interface Props {
    banner: BannerState;
    onChange: (banner: BannerState) => void;
}

export const Banner: FunctionComponent<Props> = ({ banner, onChange }) => {
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);
    const [bannerPosition, setBannerPosition] = useState<number>(banner.position || 50);

    const onSubmit = (type: BannerType, value: string | Color): void => {
        onChange({ ...banner, type, value, position: bannerPosition });
    };

    const setPosition = (dir: 'up' | 'down'): void => {
        let newPosition = bannerPosition;

        switch (dir) {
            case 'down':
                if (bannerPosition < 90) {
                    newPosition = bannerPosition + 10;
                }
                break;
            case 'up':
                if (bannerPosition > 10) {
                    newPosition = bannerPosition - 10;
                }
                break;
            default:
                throw new Error(`Invalid direction - ${dir}`);
        }

        setBannerPosition(newPosition);
    };

    return (
        <>
            <BannerChangeModal
                isOpen={isBannerSelectOpen}
                onClose={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                onChange={onSubmit}
                banner={banner}
            />
            <Box className="sb-banner" borderRadius="xl" overflow="hidden" height={{ base: '180px', md: '240px' }}>
                <Button
                    size="sm"
                    borderRadius="lg"
                    className="sb-banner-button"
                    colorScheme="gray"
                    boxShadow="sm"
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                >
                    Change Banner
                </Button>
                {banner.type === BannerType.Color ? (
                    <Box bg={banner.value} className="sb-banner-image" />
                ) : (
                    <>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-up"
                            className="edit-button-up"
                            size="xs"
                            boxShadow="sm"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('up')}
                        >
                            <SbArrowUpIcon />
                        </IconButton>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-down"
                            className="edit-button-down"
                            size="xs"
                            boxShadow="sm"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('down')}
                        >
                            <SbArrowDownIcon />
                        </IconButton>
                        <Image
                            draggable="false"
                            objectPosition={`left ${bannerPosition}%`}
                            src={banner.value}
                            className="sb-banner-image"
                        />
                    </>
                )}
            </Box>
        </>
    );
};
