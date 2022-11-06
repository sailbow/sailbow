import { FC, useEffect, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { BannerType, Boat } from 'modules/boats/Boat.Types';
import { BoatBanner } from '../boat-banner/BoatBanner';

import './BoatCard.scss';
import { getFontColor } from 'util/functions/FontColor';

interface Props {
    boat: Boat;
}

export const BoatCard: FC<Props> = ({ boat }) => {
    const navigate = useNavigate();
    const [fontColor, setFontColor] = useState<string>('#000');

    useEffect(() => {
        (async () => {
            if (boat.banner.type === BannerType.Link) {
                const color = await getFontColor(boat.banner.value);
                console.log(boat.name, color);
                setFontColor(color);
            }
        })();
    }, [boat]);

    const onClick = () => {
        navigate(`/boats/${boat.id}`);
    };

    return (
        <Box
            height="320px"
            borderRadius="3xl"
            w="100%"
            className="sb-boat-card"
            cursor="pointer"
            onClick={onClick}
            position="relative"
        >
            <BoatBanner id="home" banner={boat.banner} showControls={false} />
            <Box p="6" color={fontColor} position="absolute" bottom="0" left="0" className="sb-cover-info">
                <Text fontSize="xl" fontWeight="semibold">
                    {boat.name}
                </Text>
                <Text fontSize="sm" noOfLines={2}>
                    {boat.description}
                </Text>
            </Box>
        </Box>
    );
};
