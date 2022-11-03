import { Logo } from 'shared/icons/Icons';
import { Routes } from 'router/Router.Types';

export const SidebarWidth = 80;

interface LinkItemProps {
    name: string;
    icon: any;
    route?: string;
    show?: boolean;
}

export const LinkItems: Array<LinkItemProps> = [
    { name: 'Boats', icon: Logo, route: Routes.Private.Boats, }
    // { name: 'For You', icon: FcDiscoverIcon, route: new RegExp('/for-you') },
    // { name: 'Trending', icon: FcTrendingUpIcon, route: new RegExp('/trending') },
    // { name: 'Settings', icon: FcSettingsIcon, route: AppRoutes.Private.Room }
];

export interface LayoutStoreState {
    mobileNavOpen: boolean;
}