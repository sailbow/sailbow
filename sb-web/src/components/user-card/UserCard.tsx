import React, { FunctionComponent } from 'react';

import { Avatar, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';

import { Role } from 'components/role/Role';
import { customStyles } from 'theme/SelectStyles';
import { Checkmark, Close } from 'util/Icons';

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
            <Flex alignItems="center">
                <Avatar variant="square" name="Hrishikesh Paul" size="sm" />
                <Text fontWeight="normal" pl="4">
                    Hrishikesh Paul
                </Text>
            </Flex>
            <Select
                onChange={(e) => console.log(e)}
                isSearchable={false}
                styles={customStyles}
                options={GatherCrewRoleOptions}
                components={{
                    IndicatorSeparator: () => null,
                    Option: RoleOption,
                }}
            />
        </Flex>
    );
};
