import { ReactNode } from "react";

export enum CreateNavMode {
    Create,
    Edit,
}

export interface SystemState {
    pickerOpen: boolean;
    createNavOpen: boolean;
    createNavMode: CreateNavMode;
    crewNavOpen: boolean;
    crewInviteModalOpen: boolean;
    moreMenuDrawerOpen: boolean;
    moreMenuOptions?: ReactNode;
    currentRoute: string;
}
