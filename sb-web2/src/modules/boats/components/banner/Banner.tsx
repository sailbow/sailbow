import { FunctionComponent, useState } from 'react';

import { Box, Image, Button } from '@chakra-ui/react';

import { BannerState, BannerType } from 'modules/boats/Boat.Types';
import { BannerChangeModal } from 'modules/boats/components/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/colors/Colors';

import './Banner.scss';

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
            <Box
                className={`sb-cover sb-cover--${id}`}
                borderRadius="xl"
            >
                <Button
                    display={showControls ? 'flex' : 'none'}
                    size="sm"
                    borderRadius="lg"
                    className="sb-cover-button"
                    colorScheme="gray"
                    bg="white"
                    boxShadow="sm"
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                >
                    Change Banner
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

Banner.defaultProps = {
    onChange: null,
    showControls: true,
};
