import { FC } from 'react';

import { useSystem } from 'modules/system/System.Store';
import { Drawer } from 'shared/drawer/Drawer';

export const BoatModulesPicker: FC = () => {
    const [{ pickerOpen }, { closePicker }] = useSystem();
    return (
        <Drawer isOpen={pickerOpen} onClose={closePicker} title="Pick a Widget" size="md">
            All widgets go here
        </Drawer>
    );
};
