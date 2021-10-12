import React, { FunctionComponent, useState } from 'react';

import { Avatar, Box, Flex, Icon, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';

import { Role } from 'components/role/Role';
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
    { label: 'Remove', value: -1, color: 'brand.error' },
];

export const UserCard: FunctionComponent = () => {
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
        <Flex justifyContent="space-between">
            <Flex alignItems="center" overflow="hidden">
                <Avatar variant="square" name="Hrishikesh Paul" size="sm" />
                <Text fontWeight="normal" pl="4" isTruncated>
                    Name goes here
                </Text>
            </Flex>
            <Box pl="4">
                <Select
                    onChange={(role: any) => {
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
