import { FC } from 'react';

import { useSystem } from '@/modules/system/System.Store';
import { Drawer } from 'shared/drawer/Drawer';

export const MoreMenuMobileDrawer: FC = () => {
    const [{ moreMenuDrawerOpen, moreMenuOptions }, { closeMoreMenuDrawer }] = useSystem();

    return (
        <Drawer placement="bottom" isOpen={moreMenuDrawerOpen} onClose={closeMoreMenuDrawer} mode="menu">
            {moreMenuOptions}
        </Drawer>
    );
};
