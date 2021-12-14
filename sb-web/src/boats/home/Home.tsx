import React, { FunctionComponent, useEffect } from 'react';

import { Link } from '@chakra-ui/react';

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

    return !loading.get && boats ? (
        <div className="container">
            {boats.map((boat: Boat) => {
                return (
                    <>
                        <Link fontSize="xl" href={`/boats/${boat.id}`}>
                            {boat.name}
                        </Link>
                        <br />
                    </>
                );
            })}
        </div>
    ) : (
        <Loading />
    );
};
