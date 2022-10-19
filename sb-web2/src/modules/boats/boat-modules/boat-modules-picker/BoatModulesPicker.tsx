import { FC } from 'react';

import { Box, Stack } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { ModuleName } from 'modules/boats/Boat.Types';
import { BoatWidgetDetails } from 'modules/boats/common/boat-widget/BoatWidgetDetails';
import { Drawer } from 'shared/drawer/Drawer';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from '../modules/Modules';

const moduleList = [ModuleName.Date, ModuleName.Location];

export const BoatModulesPicker: FC = () => {
    const [{}, { addModule }] = useBoat();
    const [{ pickerOpen }, { closePicker }] = useSystem();

    return (
        <Drawer isOpen={pickerOpen} onClose={closePicker} title="Pick a Widget" size="md">
            <Stack w="100%" spacing="4">
                {moduleList.map((module) => {
                    const m = ModulesMapper[module];

                    return (
                        <Box
                            key={`picker-option-${module}`}
                            borderRadius="xl"
                            borderStyle="solid"
                            borderWidth="2px"
                            borderColor="brand.border-light"
                            p="4"
                            _hover={{ borderColor: 'brand.primary', cursor: 'pointer' }}
                            _active={{ bg: '#fafafa' }}
                            onClick={() => {
                                addModule(module, []);
                                closePicker();
                            }}
                        >
                            <BoatWidgetDetails name={m.name} image={<m.image />} info={m.info} />
                        </Box>
                    );
                })}
            </Stack>
        </Drawer>
    );
};
