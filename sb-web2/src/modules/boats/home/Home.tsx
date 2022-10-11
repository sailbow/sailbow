import { FunctionComponent, useEffect } from 'react';

import { Box, Center, Flex, SimpleGrid } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { BoatCard } from 'modules/boats/components';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { SbFilterIcon, SbSearchIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

import { HomeFilter } from './home-filter/HomeFilter';
import { HomeSort } from './home-sort/HomeSort';
import './Home.scss';

export const Home: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    return (
        <Box px={{ base: 0, md: 4 }} className="sb-home" w="100%">
            {!loading.getAll && boats ? (
                <>
                    {boats.length ? (
                        <>
                            <Flex w="100%" justifyContent="space-between" alignItems="center" gap="4" pt="6">
                                <Input
                                    leftIcon={<SbSearchIcon />}
                                    rightIconButton={<SbFilterIcon />}
                                    placeholder="Search boats..."
                                    w="100%"
                                />
                            </Flex>
                            <SimpleGrid pt="8" minChildWidth="300px" spacing={{ base: '24px', md: '36px' }}>
                                {boats.map((boat: Boat) => {
                                    return <BoatCard boat={boat} key={boat.id} />;
                                })}
                            </SimpleGrid>
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
