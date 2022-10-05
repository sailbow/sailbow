import { FC } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { Banner } from '../banner/Banner';

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
            // w={{ base: '100%', md: '360px' }}
            boxShadow="lg"
            transition="0.2s box-shadow ease-in-out"
            _hover={{ boxShadow: 'xl' }}
            borderRadius="xl"
            cursor="pointer"
            onClick={onClick}
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
