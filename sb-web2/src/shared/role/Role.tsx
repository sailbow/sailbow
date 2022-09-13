import { FunctionComponent, useState } from 'react';

import { Flex, Icon, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';

import { Crew, Role, RoleLabel } from 'modules/boats/Boat.Types';
import { SbCheckIcon } from 'shared/icons/Icons';
import { customStyles } from 'shared/select/SelectStyles';

export const RoleToLabelMapper = {
    [Role.Captain]: RoleLabel.Captain,
    [Role.Assistant]: RoleLabel.Assistant,
    [Role.Sailor]: RoleLabel.Sailor,
};

type OptionType = { label: string; value: string };

const CaptainRoleOption = [{ label: RoleLabel.Captain, value: Role.Captain }];

export const GatherCrewRoleOptions = [
    {
        label: 'Roles',
        options: [
            { label: RoleLabel.Assistant, value: Role.Assistant },
            { label: RoleLabel.Sailor, value: Role.Sailor },
        ],
    },
];

interface Props {
    user: Crew;
}

export const RoleSelect: FunctionComponent<Props> = ({ user }) => {
    const [selectedRole, setSelectedRole] = useState<OptionType>({
        label: RoleToLabelMapper[user.role],
        value: user.role,
    });

    const onRoleChange = (role: string, data: Crew) => {
        switch (role) {
            case Role.Assistant: {
                console.log('change to assistant', data);
                break;
            }
            case Role.Sailor: {
                console.log('change to Sailor', data);
                break;
            }
            case Role.Captain:
                break;
            default: {
                throw new Error(`Invalid role -- ${role}`);
            }
        }
    };

    const getOptions = (): any[] => {
        if (user.role === Role.Captain) {
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
