import { FunctionComponent } from 'react';

import { useBreakpointValue } from '@chakra-ui/react';
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
    
    return isMobile ? <NavbarMobileTop onRoute={onRoute} /> : <NavbarDesktop onRoute={onRoute} />;
};
