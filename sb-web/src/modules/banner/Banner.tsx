import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { BannerType } from 'contexts/boat/BoatConstants';
import { BannerSelectModal } from 'modules/banner/banner-select-modal/BannerSelectModal';
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
            <BannerSelectModal
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
                <Box bg={boat.banner.value} className="sb-banner-image" />
            </Box>
        </>
    );
};
