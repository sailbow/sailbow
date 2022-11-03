import { FC } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { BoatBanner } from '../boat-banner/BoatBanner';

import Color from 'color-thief-react';

import './BoatCard.scss';

interface Props {
    boat: Boat;
}

export const BoatCard: FC<Props> = ({ boat }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/boats/${boat.id}`);
    };

    return (
        <Box height="320px" borderRadius="3xl" w="100%" className="sb-boat-card" cursor="pointer">
            <BoatBanner id="home" banner={boat.banner} showControls={false} />

            
        </Box>
    );
};
