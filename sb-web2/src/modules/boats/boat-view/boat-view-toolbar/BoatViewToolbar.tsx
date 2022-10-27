import { FunctionComponent } from 'react';

import { Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { Routes } from 'router/Router.Types';

interface Props {
    boat: Boat;
}

export const BoatViewToolbar: FunctionComponent<Props> = ({ boat }) => {
    const navigate = useNavigate();

    return (
        <Flex justifyContent="space-between" pb="4" pt="2" alignItems="center" w="100%">
            <Breadcrumb spacing="8px" fontWeight="semibold">
                <BreadcrumbItem>
                    <BreadcrumbLink color="brand.secondary" onClick={() => navigate(Routes.Private.Boats)}>
                        Your Boats
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem fontSize="xl">
                    <BreadcrumbLink isCurrentPage color="brand.700">
                        {boat.name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </Flex>
    );
};
