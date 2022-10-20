export enum CreateNavMode {
    Create,
    Edit,
}

export interface SystemState {
    pickerOpen: boolean;
    createNavOpen: boolean;
    createNavMode: CreateNavMode;
}
