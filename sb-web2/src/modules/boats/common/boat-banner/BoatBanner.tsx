import { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BannerState, BannerType } from 'modules/boats/Boat.Types';
import { BannerChangeModal } from 'modules/boats/common/boat-banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/colors/Colors';

import './BoatBanner.scss';

interface Props {
    banner: BannerState;
    id: string;
    showControls?: boolean;
    onChange?: ((banner: BannerState) => void) | null;
}

export const BoatBanner: FunctionComponent<Props> = ({ banner, id, showControls, onChange }) => {
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
            <Box className={`sb-cover sb-cover--${id}`} borderRadius="3xl" zIndex={showControls ? 1 : -1}>
                <Button
                    display={showControls ? 'flex' : 'none'}
                    size="sm"
                    borderRadius="lg"
                    className="sb-cover-button"
                    colorScheme="gray"
                    bg="white"
                    boxShadow="sm"
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                    zIndex="1"
                >
                    Change Image
                </Button>
                {banner.type === BannerType.Color ? (
                    <Box bg={banner.value} className="sb-cover-image" />
                ) : (
                    <Image draggable="false" src={banner.value} className="sb-cover-image" />
                )}
            </Box>
        </>
    );
};
