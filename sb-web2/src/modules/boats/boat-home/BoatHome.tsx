import { FunctionComponent, useEffect } from 'react';

import { Box, Center } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { BoatCard } from 'modules/boats/common';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';

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
                        <Box className="container">
                            {boats.map((boat: Boat) => {
                                return <BoatCard boat={boat} key={boat.id} />;
                            })}
                        </Box>
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
