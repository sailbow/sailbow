import React, { FunctionComponent } from 'react';

import { Box, Image, Button, Tooltip } from '@chakra-ui/react';

import { useBoat } from 'contexts/boat/Boat';
import { Pencil } from 'util/Icons';

import 'modules/banner/Banner.scss';

export const Banner: FunctionComponent = () => {
    const [boat, dispatch] = useBoat();

    return (
        <>
            <Box className="sb-banner" borderRadius="xl" overflow="hidden">
                <Button className="sb-banner-button" colorScheme="gray" background="white" leftIcon={<Pencil />}>
                    Change Banner
                </Button>
                <Box bg={boat.bannerColor} className="sb-banner-image" />
                <Box bg="brand.dark" className="sb-banner-overlay" />
            </Box>
        </>
    );
};
