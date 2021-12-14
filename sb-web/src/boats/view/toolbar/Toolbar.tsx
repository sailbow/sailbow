import React, { FunctionComponent } from 'react';

import { Flex, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

import { SbSettingsIcon, SbUserGroup } from 'util/icons/Icons';
import { Boat } from 'boats/Boat.Types';
import { LinkButton } from 'boats/components/link-button/LinkButton';

interface Props {
    boat: Boat;
}

export const Toolbar: FunctionComponent<Props> = ({ boat }) => {
    return (
        <Flex justifyContent="space-between" alignItems="center" pb="4" bg="white">
            <Flex alignItems="center">
                <Breadcrumb spacing="8px" fontWeight="semibold">
                    <BreadcrumbItem>
                        <BreadcrumbLink color="brand.muted">Boats</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink dis isCurrentPage color="teal.600">
                            {boat.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>
            <Flex>
                <LinkButton />
                <IconButton
                    fontSize="xl"
                    aria-label="users"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbUserGroup />}
                />
                <IconButton
                    fontSize="xl"
                    aria-label="settings"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbSettingsIcon />}
                />
            </Flex>
        </Flex>
    );
};
