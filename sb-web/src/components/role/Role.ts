export enum Role {
    Captain,
    Assistant,
    Sailor,
}

export enum RoleAction {
    Remove = -1,
}

export enum RoleLabel {
    Captain = 'Captain',
    Assistant = 'Assistant',
    Sailor = 'Sailor',
}

export const RoleToLabelMapper = {
    [Role.Captain]: RoleLabel.Captain,
    [Role.Assistant]: RoleLabel.Assistant,
    [Role.Sailor]: RoleLabel.Sailor,
};
