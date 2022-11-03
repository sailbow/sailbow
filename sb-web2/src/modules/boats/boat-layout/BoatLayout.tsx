import { ReactNode } from 'react';

import { Box, Skeleton, Stack, VStack } from '@chakra-ui/react';

import { useBoat } from '../Boat.Store';
import { BoatViewMode } from '../Boat.Types';
import { BoatModuleManifest } from '../boat-modules/BoatModulesManifest';
import { Input } from 'shared/input/Input';

export const SidebarWidth = 80;

export default function SystemLayout({ children }: { children: ReactNode }) {
    const [{ activeBoat, viewMode, loading }] = useBoat();

    return (
        <Box minH="100vh" h="100%" className="sb-layout">
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
                    {viewMode === BoatViewMode.Home && (
                        <VStack pl="4">
                            <Input />
                        </VStack>
                    )}

                    {viewMode === BoatViewMode.Boat && (
                        <>
                            {activeBoat && !loading.get ? (
                                <BoatModuleManifest boat={activeBoat} />
                            ) : (
                                <Stack spacing="4" pl="4">
                                    <Skeleton h={300} />
                                    <Skeleton h={100} />
                                    <Skeleton h={100} />
                                </Stack>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <Box className="sb-sidebar-body" ml={{ base: 0, md: SidebarWidth }} height="100%">
                {children}
            </Box>
        </Box>
    );
}
