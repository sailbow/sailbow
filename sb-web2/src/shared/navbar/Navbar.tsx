import { FunctionComponent } from 'react';

import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Container,
    Flex,
    IconButton,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { NavbarMobileTop } from 'shared/navbar/navbar-mobile/NavbarMobileTop';
import { NavbarDesktop } from 'shared/navbar/navbar-desktop/NavbarDesktop';

import 'shared/navbar/Navbar.scss';
import { BoatRoutes, Routes } from 'router/Router.Types';
import { useSystem } from 'modules/system/System.Store';
import { useBoat } from 'modules/boats/Boat.Store';
import { Input } from 'shared/input/Input';
import { SbFilterIcon } from 'shared/icons/Icons';

export const Navbar: FunctionComponent = () => {
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [{ currentRoute }] = useSystem();
    const [{ activeBoat }] = useBoat();

    const onRoute = (path: string) => {
        if (window.location.pathname !== path) navigate(path);
    };

    return (
        <Box position="fixed" top="0" w="100%" left="50%" transform="translateX(-50%)" bg="white" zIndex={100}>
            <Container maxW="8xl">
                {isMobile ? <NavbarMobileTop onRoute={onRoute} /> : <NavbarDesktop onRoute={onRoute} />}
                {/* <Flex justifyContent="space-between" alignItems="center" py="4">
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
                </Flex> */}
            </Container>
        </Box>
    );
};
