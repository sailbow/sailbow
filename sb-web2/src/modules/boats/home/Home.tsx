import { FunctionComponent, useEffect } from 'react';

import { Box, Flex, Heading, IconButton, SimpleGrid } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { BoatCard } from 'modules/boats/components';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { SbSearchIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

import { HomeFilter } from './home-filter/HomeFilter';
import './Home.scss';

export const Home: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    return (
        <Box px="4" className="sb-home" w="100%">
            {/* <Heading fontSize="4xl">Your Boats</Heading> */}
            <Flex w="100%" justifyContent="space-between" alignItems="center" gap="4">
                <Input leftIcon={<SbSearchIcon />} placeholder="Search boats..." w="100%" />

                <Flex>
                    <HomeFilter />
                </Flex>
            </Flex>
            {!loading.getAll && boats ? (
                <SimpleGrid pt="8" minChildWidth="300px" spacing="48px">
                    {boats.map((boat: Boat) => {
                        return <BoatCard boat={boat} key={boat.id} />;
                    })}
                </SimpleGrid>
            ) : (
                <PageSpinner loading={loading.getAll} />
            )}
        </Box>
    );
};
