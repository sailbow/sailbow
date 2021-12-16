import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';

import { Boat } from 'boats/Boat.Types';
import { useBoat } from 'boats/Boat.Store';
import { Loading } from 'components/loading/Loading';
import { Banner } from 'boats/components';

export const Home: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    const Card: FunctionComponent<{ boat: Boat }> = ({ boat }) => {
        const onClick = () => {
            window.location.href = `/boats/${boat.id}`;
        };
        return (
            <Box
                w={{ base: '100%', md: '400px' }}
                boxShadow="lg"
                transition="0.2s box-shadow ease-in-out"
                _hover={{ boxShadow: 'xl' }}
                p="4"
                borderRadius="xl"
                cursor="pointer"
                onClick={onClick}
            >
                <Box>
                    <Banner banner={boat.banner} showControls={false} />
                </Box>
                <Text fontSize="lg" pt="2" fontWeight="semibold">
                    {boat.name}
                </Text>
            </Box>
        );
    };

    return !loading.get && boats ? (
        <Box p={{ base: 0, sm: 4 }}>
            <Heading fontSize="2xl">Your Boats</Heading>
            <SimpleGrid pt="8" minChildWidth="400px" spacing="10px">
                {boats.map((boat: Boat) => {
                    return <Card boat={boat} key={boat.id} />;
                })}
            </SimpleGrid>
        </Box>
    ) : (
        <Loading />
    );
};
