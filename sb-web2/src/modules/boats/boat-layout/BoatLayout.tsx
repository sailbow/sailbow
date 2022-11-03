// From https://chakra-templates.dev/templates/navigation/sidebar/sidebarWithHeader

import { ReactNode, useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useBoat } from '../Boat.Store';
import { BoatViewMode } from '../Boat.Types';
import { BoatModuleManifest } from '../boat-modules/BoatModulesManifest';
import { Input } from 'shared/input/Input';

export const SidebarWidth = 80;

export default function SystemLayout({ children }: { children: ReactNode }) {
    const [{ activeBoat, viewMode }] = useBoat();

    return (
        <Box minH="100vh" h="100%" className="sb-layout">
            {/* <Drawer
                autoFocus={false}
                isOpen={mobileNavOpen}
                placement="left"
                onClose={closeMobileNav}
                returnFocusOnClose={false}
                onOverlayClick={closeMobileNav}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={closeMobileNav} />
                </DrawerContent>
            </Drawer> */}

            <Box
                zIndex={999}
                transition="0.75 ease"
                w={{ base: 'full', md: SidebarWidth }}
                pos="fixed"
                h="full"
                className="sb-layout-sidebar"
                display={{ base: 'none', md: 'block' }}
                pl="4"
            >
                {viewMode === BoatViewMode.Home && (
                    <VStack>
                        <Input />
                    </VStack>
                )}

                {viewMode === BoatViewMode.Boat && activeBoat && <BoatModuleManifest boat={activeBoat} />}
            </Box>

            <Box className="sb-sidebar-body" ml={{ base: 0, md: SidebarWidth }} height="100%">
                {children}
            </Box>
        </Box>
    );
}
