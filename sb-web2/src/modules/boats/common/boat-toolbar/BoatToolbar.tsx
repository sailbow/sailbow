import { FunctionComponent } from 'react';

import { Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink, IconButton, Box, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { BoatRoutes, Routes } from 'router/Router.Types';
import { Input } from 'shared/input/Input';
import { SbFilterIcon } from 'shared/icons/Icons';
import { useSystem } from 'modules/system/System.Store';
import { useBoat } from 'modules/boats/Boat.Store';

export const BoatToolbar: FunctionComponent = () => {
    const navigate = useNavigate();
    const [{ currentRoute }] = useSystem();
    const [{ activeBoat }] = useBoat();

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            p="4"
            display={{ base: 'none', md: 'flex' }}
            position="fixed"
            left="50%"
            transform="translateX(-50%)"
            zIndex={4}
        >
            <Breadcrumb spacing="8px" fontWeight="semibold">
                <BreadcrumbItem>
                    <BreadcrumbLink color="brand.secondary" onClick={() => navigate(Routes.Private.Boats.base)}>
                        Your Boats
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {currentRoute === BoatRoutes.BoatView && (
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage color="brand.700">
                            {activeBoat?.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {/* */}
            </Breadcrumb>
            {currentRoute === BoatRoutes.BoatHome && (
                <Box width="30%">
                    <Input
                        placeholder="Search boats..."
                        rightIconButton={
                            <IconButton
                                variant="icon"
                                icon={<SbFilterIcon />}
                                aria-label="search-boats-input"
                                fontSize="lg"
                            />
                        }
                    />
                </Box>
            )}
        </Flex>
    );
};
