import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { BannerType } from 'contexts/boat/BoatConstants';
import { BannerChangeModal } from 'modules/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/Colors';
import { Pencil } from 'util/Icons';

import 'modules/banner/Banner.scss';

export const Banner: FunctionComponent = () => {
    const [boat, dispatch] = useBoat();
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);

    const onSubmit = (type: BannerType, value: string | Color) => {
        console.log(typeof value, value);
        dispatch({ type: BoatActionType.SetDetails, payload: { ...boat, banner: { type, value } } });
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
                    <Image src={boat.banner.value} className="sb-banner-image" />
                )}
            </Box>
        </>
    );
};
