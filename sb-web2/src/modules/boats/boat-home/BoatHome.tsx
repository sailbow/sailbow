import { FunctionComponent, useEffect } from 'react';

import { Box, Center, Flex, IconButton } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { BoatCard } from 'modules/boats/common';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { SbFilterIcon, SbSearchIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

import 'modules/boats/boat-home/BoatHome.scss';

export const BoatHome: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    return (
        <Box className="sb-home" w="100%" pb="8">
            {!loading.getAll && boats ? (
                <>
                    {boats.length ? (
                        <>
                            <Flex w="100%" justifyContent="space-between" alignItems="center" gap="4" pt="6">
                                <Input
                                    leftIcon={<SbSearchIcon />}
                                    rightIconButton={
                                        <IconButton
                                            aria-label="home-filter-search"
                                            icon={<SbFilterIcon />}
                                            variant="icon"
                                            colorScheme="gray"
                                        />
                                    }
                                    placeholder="Search boats..."
                                    w="100%"
                                />
                            </Flex>
                            {/* <Container maxW="4xl">
                                <VStack spacing="8" mt="6">
                                    {boats.map((boat: Boat) => {
                                        return <BoatCard boat={boat} key={boat.id} />;
                                    })}
                                </VStack>
                            </Container> */}
                            <Box className="container" mt="8">
                                {boats.map((boat: Boat) => {
                                    return <BoatCard boat={boat} key={boat.id} />;
                                })}
                            </Box>
                        </>
                    ) : (
                        <Center>No Boats</Center>
                    )}
                </>
            ) : (
                <PageSpinner loading={loading.getAll} />
            )}
        </Box>
    );
};
