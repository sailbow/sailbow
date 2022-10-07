import { FunctionComponent } from 'react';

import { Flex, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Boat } from 'modules/boats/Boat.Types';
import { LinkButton } from 'modules/boats/components/link-button/LinkButton';
import { SbSettingsIcon } from 'shared/icons/Icons';
import { Routes } from 'router/Router.Types';

interface Props {
    boat: Boat;
}

export const Toolbar: FunctionComponent<Props> = ({ boat }) => {
    const navigate = useNavigate();

    return (
        <Flex justifyContent="space-between" pb="4" bg="white" alignItems="center">
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
                <LinkButton />

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
