import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BannerState, BannerType } from 'boats/Boat.Types';
import { BannerChangeModal } from 'boats/components/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/Colors';

import 'boats/components/banner/Banner.scss';

interface Props {
    banner: BannerState;
    id: string;
    showControls?: boolean;
    onChange?: ((banner: BannerState) => void) | null;
}

export const Banner: FunctionComponent<Props> = ({ banner, id, showControls, onChange }) => {
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);

    const onSubmit = (type: BannerType, value: string | Color): void => {
        if (onChange) {
            onChange({ ...banner, type, value });
        }
    };

    return (
        <>
            <BannerChangeModal
                isOpen={isBannerSelectOpen}
                onClose={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                onChange={onSubmit}
                banner={banner}
            />
            <Box className={`sb-banner sb-banner--${id}`} borderRadius="xl" overflow="hidden">
                <Button
                    display={showControls ? 'flex' : 'none'}
                    size="sm"
                    borderRadius="lg"
                    className="sb-banner-button"
                    colorScheme="gray"
                    bg="white"
                    boxShadow="sm"
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                >
                    Change Banner
                </Button>
                {banner.type === BannerType.Color ? (
                    <Box bg={banner.value} className="sb-banner-image" />
                ) : (
                    <Box>
                        <Image draggable="false" src={banner.value} className="sb-banner-image" />
                    </Box>
                )}
            </Box>
        </>
    );
};

Banner.defaultProps = {
    onChange: null,
    showControls: true,
};
