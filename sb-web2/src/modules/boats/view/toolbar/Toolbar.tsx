import { FunctionComponent } from 'react';

import { Flex, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { LinkButton } from 'modules/boats/components/link-button/LinkButton';
import { SbSettingsIcon, SbUserGroup } from 'shared/icons/Icons';

interface Props {
    boat: Boat;
}

export const Toolbar: FunctionComponent<Props> = ({ boat }) => {
    return (
        <Flex justifyContent="space-between" pb="4" bg="white" alignItems="center">
            <Breadcrumb spacing="8px" fontWeight="semibold">
                <BreadcrumbItem>
                    <BreadcrumbLink color="brand.secondary">Your Boats</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem fontSize="2xl">
                    <BreadcrumbLink isCurrentPage color="brand.700">
                        {boat.name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Flex justifyContent="flex-end">
                <LinkButton />
                <IconButton
                    fontSize="2xl"
                    aria-label="users"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbUserGroup />}
                />
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
