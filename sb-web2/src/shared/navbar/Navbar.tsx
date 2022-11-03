import { FunctionComponent } from 'react';

import { Box, Container, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { NavbarMobileTop } from 'shared/navbar/navbar-mobile/NavbarMobileTop';
import { NavbarDesktop } from 'shared/navbar/navbar-desktop/NavbarDesktop';

import 'shared/navbar/Navbar.scss';

export const Navbar: FunctionComponent = () => {
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const onRoute = (path: string) => {
        if (window.location.pathname !== path) navigate(path);
    };

    return (
        <Box position="fixed" top="0" w="100%" left="50%" transform="translateX(-50%)" bg="white" zIndex={100}>
            <Container maxW="8xl">
                {isMobile ? <NavbarMobileTop onRoute={onRoute} /> : <NavbarDesktop onRoute={onRoute} />}
            </Container>
        </Box>
    );
};
