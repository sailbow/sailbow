import { FC } from 'react';

import { Box, Stack } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { BoatWidgetDetails } from 'modules/boats/common/boat-widget/BoatWidgetDetails';
import { Drawer } from 'shared/drawer/Drawer';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from '../modules/Modules';

export const BoatModulesPicker: FC = () => {
    const [, { addModule }] = useBoat();
    const [{ pickerOpen }, { closePicker }] = useSystem();

    return (
        <Drawer isOpen={pickerOpen} onClose={closePicker} title="Pick a Widget" size="md">
            <Stack w="100%" spacing="4">
                {Object.values(ModulesMapper).map((module) => {
                    return (
                        <Box
                            key={`picker-option-${module.type}`}
                            borderRadius="xl"
                            borderStyle="solid"
                            borderWidth="2px"
                            borderColor="brand.border-light"
                            p="4"
                            _hover={{ borderColor: 'brand.primary', cursor: 'pointer' }}
                            _active={{ bg: '#fafafa' }}
                            onClick={() => {
                                addModule(module.type);
                                closePicker();
                            }}
                        >
                            <BoatWidgetDetails name={module.name} image={<module.image />} info={module.info} />
                        </Box>
                    );
                })}
            </Stack>
        </Drawer>
    );
};
