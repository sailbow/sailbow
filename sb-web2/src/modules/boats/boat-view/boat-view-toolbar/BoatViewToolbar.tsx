import { FunctionComponent } from 'react';

import { Flex, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { BoatShare } from 'modules/boats/common/boat-share/BoatShare';
import { SbSettingsIcon } from 'shared/icons/Icons';
import { Routes } from 'router/Router.Types';

interface Props {
    boat: Boat;
}

export const BoatViewToolbar: FunctionComponent<Props> = ({ boat }) => {
    const navigate = useNavigate();

    return (
        <Flex justifyContent="space-between" pb="4" pt="2" alignItems="center">
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

            <Flex justifyContent="flex-end">
                <BoatShare />

                <IconButton
                    fontSize="2xl"
                    aria-label="settings"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbSettingsIcon />}
                />
            </Flex>
        </Flex>
    );
};
