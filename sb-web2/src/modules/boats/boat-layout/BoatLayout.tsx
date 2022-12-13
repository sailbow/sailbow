import { ReactNode } from 'react';

import { Box, Skeleton, Stack } from '@chakra-ui/react';

import { useBoat } from '../Boat.Store';
import { BoatViewMode } from '../Boat.Types';
import { BoatModuleManifest } from '../boat-modules/BoatModulesManifest';

export const SidebarWidth = '400px';

export default function BoatLayout({ children }: { children: ReactNode }) {
    const [{ activeBoat, viewMode, loading }] = useBoat();

    return (
        <Box minH="100vh" h="100%" className="sb-layout">
            {viewMode === BoatViewMode.Boat && (
                <Box
                    zIndex={999}
                    transition="0.75 ease"
                    w={{ base: 'full', md: SidebarWidth }}
                    pos="fixed"
                    h="full"
                    className="sb-layout-sidebar"
                    display={{ base: 'none', md: 'block' }}
                >
                    <Box overflow="auto" maxH="calc(100vh - 66px)">
                        {activeBoat && !loading.get ? (
                            <BoatModuleManifest boat={activeBoat} />
                        ) : (
                            <Stack spacing="4" pl="4">
                                <Skeleton h={300} />
                                <Skeleton h={100} />
                                <Skeleton h={100} />
                            </Stack>
                        )}
                    </Box>
                </Box>
            )}

            <Box
                className="sb-sidebar-body"
                ml={{ base: 0, md: viewMode === BoatViewMode.Boat ? SidebarWidth : 0 }}
                height="100%"
            >
                {children}
            </Box>
        </Box>
    );
}
