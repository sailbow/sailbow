import React, { FunctionComponent, useState } from 'react';

import { Avatar, Box, Flex, Icon, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';

import { Role, RoleAction } from 'components/role/Role';
import { customStyles } from 'theme/SelectStyles';
import { Checkmark } from 'util/Icons';

interface Option {
    label: string;
    value: Role;
}

export const GatherCrewRoleOptions = [
    {
        label: 'Roles',
        options: [
            { label: 'Assistant', value: Role.Assistant },
            { label: 'Sailor', value: Role.Sailor },
        ],
    },
    { label: 'Remove', value: RoleAction.Remove, color: 'brand.error' },
];

interface Props {
    showActions?: boolean;
    user: any; // needs to change to user
    onChange?: (value: number, _data: any) => void;
}

export const UserCard: FunctionComponent<Props> = ({ showActions, user, onChange }) => {
    const [selectedRole, setSelectedRole] = useState<Option>({
        label: 'Sailor',
        value: Role.Sailor,
    });

    const RoleOption: FunctionComponent = (props: any) => {
        const { data, isSelected } = props;
        const { color, label } = data;

        return (
            <components.Option {...props}>
                <Flex justifyContent="space-between" alignItems="center">
                    <Text color={color}>{label}</Text>
                    {isSelected && <Icon as={Checkmark} w={4} h={4} zIndex="2" color="teal.500" fontWeight="bold" />}
                </Flex>
            </components.Option>
        );
    };

    return (
        <Flex justifyContent="space-between" w="100%">
            <Flex alignItems="center" overflow="hidden">
                <Avatar variant="square" name={user.name} size="sm" />
                <Box>
                    <Text fontWeight="normal" pl="4" isTruncated>
                        {user.name}
                    </Text>
                    <Text fontWeight="normal" pl="4" isTruncated fontSize="xs">
                        {user.info}
                    </Text>
                </Box>
            </Flex>
            <Box pl="4" display={showActions ? 'block' : 'none'}>
                <Select
                    onChange={(role: any) => {
                        if (onChange) {
                            onChange(role.value, user);
                        }

                        setSelectedRole({ label: role.label, value: role.value });
                    }}
                    value={selectedRole}
                    isSearchable={false}
                    styles={customStyles}
                    options={GatherCrewRoleOptions}
                    components={{
                        IndicatorSeparator: () => null,
                        Option: RoleOption,
                    }}
                />
            </Box>
        </Flex>
    );
};

UserCard.defaultProps = {
    showActions: true,
    onChange: () => null,
};
