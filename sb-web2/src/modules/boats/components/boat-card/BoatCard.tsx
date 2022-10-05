import { FC } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { Banner } from '../banner/Banner';
import { BrandColors } from 'theme/colors/Colors';

interface Props {
    boat: Boat;
}

export const BoatCard: FC<Props> = ({ boat }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/boats/${boat.id}`);
    };

    return (
        <Box
            transition="0.2s border ease-in-out"
            borderWidth="2px"
            borderStyle="solid"
            borderColor={BrandColors['border-light']}
            _hover={{ borderColor: BrandColors.dark }}
            borderRadius="xl"
            cursor="pointer"
            onClick={onClick}
            maxW="360px"
        >
            <Box height="200px" borderRadius="xl">
                <Banner id="home" banner={boat.banner} showControls={false} />
            </Box>
            <Box>
                <Text fontSize="lg" p="4" fontWeight="semibold">
                    {boat.name}
                </Text>
            </Box>
        </Box>
    );
};
