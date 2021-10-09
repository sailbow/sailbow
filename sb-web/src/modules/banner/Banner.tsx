import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { BannerSelectModal } from 'modules/banner/banner-select-modal/BannerSelectModal';
import { Color } from 'theme/Colors';
import { Pencil } from 'util/Icons';

import 'modules/banner/Banner.scss';

export const Banner: FunctionComponent = () => {
    const [boat, dispatch] = useBoat();
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);

    const onSubmit = (value: string | Color) => {
        console.log(typeof value, value);
        dispatch({ type: BoatActionType.SetDetails, payload: { ...boat, banner: value } });
    };

    return (
        <>
            <BannerSelectModal
                isOpen={isBannerSelectOpen}
                onClose={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                onChange={onSubmit}
                current={boat.banner}
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
                <Box bg={boat.banner} className="sb-banner-image" />
            </Box>
        </>
    );
};
