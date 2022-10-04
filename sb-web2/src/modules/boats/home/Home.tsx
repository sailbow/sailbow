import { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { Banner } from 'modules/boats/components';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';

import './Home.scss';

export const Home: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    const Card: FunctionComponent<{ boat: Boat }> = ({ boat }) => {
        const onClick = () => {
            navigate(`/boats/${boat.id}`);
        };
        return (
            <Box
                w={{ base: '100%', md: '360px' }}
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

    return !loading.getAll && boats ? (
        <Box px="4" className="sb-home">
            <Heading fontSize="2xl">Your Boats</Heading>
            <SimpleGrid pt="8" minChildWidth="400px" spacing="10px">
                {boats.map((boat: Boat) => {
                    return <Card boat={boat} key={boat.id} />;
                })}
            </SimpleGrid>
        </Box>
    ) : (
        <PageSpinner loading={loading.getAll} />
    );
};
