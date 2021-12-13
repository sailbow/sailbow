import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/layout';
import { Boat } from 'boats/Boat.Types';
import { useBoat } from 'boats/Boat.Store';
import { Loading } from 'components/loading/Loading';

export const Home: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            const r = await getBoats();
            console.log(r);
        })();
    }, []); // eslint-disable-line

    return !loading.get && boats ? <>{boats}</> : <Loading />;
};
