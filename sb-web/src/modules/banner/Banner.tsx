import React, { FunctionComponent, useState } from 'react';

import { Box, Image as ChakraImage, Button, IconButton } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { BannerType } from 'contexts/boat/BoatConstants';
import { BannerChangeModal } from 'modules/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/Colors';
import { ArrowDown, ArrowUp, Pencil } from 'util/Icons';

import 'modules/banner/Banner.scss';

export const Banner: FunctionComponent = () => {
    const [boat, dispatch] = useBoat();
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);
    const [bannerPosition, setBannerPosition] = useState<number>(50);

    const onSubmit = (type: BannerType, value: string | Color) => {
        dispatch({ type: BoatActionType.SetDetails, payload: { ...boat, banner: { type, value } } });
    };

    const setPosition = (dir: 'up' | 'down') => {
        switch (dir) {
            case 'down':
                if (bannerPosition < 90) {
                    setBannerPosition(bannerPosition + 10);
                }
                break;
            case 'up':
                if (bannerPosition > 10) {
                    setBannerPosition(bannerPosition - 10);
                }
                break;
            default:
                throw new Error(`Invalid direction - ${dir}`);
        }
    };

    return (
        <>
            <BannerChangeModal
                isOpen={isBannerSelectOpen}
                onClose={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                onChange={onSubmit}
                banner={boat.banner}
            />
            <Box className="sb-banner" borderRadius="xl" overflow="hidden">
                <Button
                    className="sb-banner-button"
                    colorScheme="gray"
                    leftIcon={<Pencil />}
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                >
                    Change Banner
                </Button>
                {boat.banner.type === BannerType.Color ? (
                    <Box bg={boat.banner.value} className="sb-banner-image" />
                ) : (
                    <>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-up"
                            className="edit-button-up"
                            size="xs"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('up')}
                        >
                            <ArrowUp />
                        </IconButton>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-down"
                            className="edit-button-down"
                            size="xs"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('down')}
                        >
                            <ArrowDown />
                        </IconButton>
                        <ChakraImage
                            draggable="true"
                            cursor="grab"
                            objectPosition={`left ${bannerPosition}%`}
                            src={boat.banner.value}
                            className="sb-banner-image"
                        />
                    </>
                )}
            </Box>
        </>
    );
};
