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

interface Props {
    showActions?: boolean;
    name: string;
    image?: string;
    _data?: any;
    info?: string;
    remove?: (id: number) => void;
}

export const UserCard: FunctionComponent<Props> = ({ showActions, name, remove, info, _data, image }) => {
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
                <Avatar variant="square" name={name} size="sm" />
                <Box>
                    <Text fontWeight="normal" pl="4" isTruncated>
                        {name}
                    </Text>
                    <Text fontWeight="normal" pl="4" isTruncated fontSize="sm">
                        {info}
                    </Text>
                </Box>
            </Flex>
            <Box pl="4" display={showActions ? 'block' : 'none'}>
                <Select
                    onChange={(role: any) => {
                        if (role.label === 'Remove') {
                            if (remove) {
                                remove(_data.value.id);
                            }
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
    _data: null,
    image: '',
    info: '',
    remove: () => null,
};
