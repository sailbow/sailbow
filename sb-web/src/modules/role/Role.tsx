import React, { FunctionComponent, useState } from 'react';

import { Flex, Icon, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';

import { Crew } from 'boats/Boat.Types';
import { SbCheckIcon } from 'util/icons/Icons';
import { customStyles } from 'theme/SelectStyles';

export enum RoleType {
    Captain = 'captain',
    Assistant = 'assistant',
    Sailor = 'sailor',
}

export enum RoleLabel {
    Captain = 'Captain',
    Assistant = 'Assistant',
    Sailor = 'Sailor',
}

export const RoleToLabelMapper = {
    [RoleType.Captain]: RoleLabel.Captain,
    [RoleType.Assistant]: RoleLabel.Assistant,
    [RoleType.Sailor]: RoleLabel.Sailor,
};

type OptionType = { label: string; value: string };

const CaptainRoleOption = [{ label: RoleLabel.Captain, value: RoleType.Captain }];

export const GatherCrewRoleOptions = [
    {
        label: 'Roles',
        options: [
            { label: RoleLabel.Assistant, value: RoleType.Assistant },
            { label: RoleLabel.Sailor, value: RoleType.Sailor },
        ],
    },
];

interface Props {
    user: Crew;
}

export const Role: FunctionComponent<Props> = ({ user }) => {
    const [selectedRole, setSelectedRole] = useState<OptionType>({
        label: RoleToLabelMapper[user.role],
        value: user.role,
    });

    const onRoleChange = (role: string, data: Crew) => {
        switch (role) {
            case RoleType.Assistant: {
                console.log('change to assistant', data);
                break;
            }
            case RoleType.Sailor: {
                console.log('change to Sailor', data);
                break;
            }
            default: {
                throw new Error(`Invalid role -- ${role}`);
            }
        }
    };

    const getOptions = (): any[] => {
        if (user.role === RoleType.Captain) {
            return CaptainRoleOption;
        }

        return GatherCrewRoleOptions;
    };

    const RoleOption: FunctionComponent = (props: any) => {
        const { data, isSelected } = props;
        const { color, label } = data;

        return (
            <components.Option {...props}>
                <Flex justifyContent="space-between" alignItems="center">
                    <Text color={color}>{label}</Text>
                    {isSelected && <Icon as={SbCheckIcon} w={4} h={4} zIndex="2" color="teal.500" fontWeight="bold" />}
                </Flex>
            </components.Option>
        );
    };
    return (
        <Select
            onChange={(role: any) => {
                onRoleChange(role.value, user);
                setSelectedRole({ label: role.label, value: role.value });
            }}
            value={selectedRole}
            isSearchable={false}
            styles={customStyles}
            options={getOptions()}
            components={{
                IndicatorSeparator: () => null,
                Option: RoleOption,
            }}
        />
    );
};
