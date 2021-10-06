import React, { FunctionComponent } from 'react';

import { Icon, Flex, Text } from '@chakra-ui/react';
import Select, { components } from 'react-select';
import { IoCheckmarkOutline as Checkmark } from 'react-icons/io5';

import { customStyles } from 'theme/SelectStyles';

interface Option {
    value: string | number | boolean;
    label: string;
}

interface Props {
    options: Array<Option>;
    isSearchable?: boolean;
    onChange: any;
    defaultValue?: Option | null;
}

export const SelectOption: FunctionComponent<any> = (props) => {
    const { data, isSelected } = props;

    return (
        <components.Option {...props}>
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{data.label}</Text>
                {isSelected && <Icon as={Checkmark} w={4} h={4} zIndex="2" color="teal.500" fontWeight="bold" />}
            </Flex>
        </components.Option>
    );
};

export const SingleSelect: FunctionComponent<Props> = ({ options, isSearchable = true, onChange, defaultValue }) => {
    return (
        <Select
            styles={customStyles}
            menuPlacement="auto"
            isSearchable={isSearchable}
            defaultValue={defaultValue}
            options={options}
            onChange={onChange}
            components={{ Option: SelectOption }}
        />
    );
};

SingleSelect.defaultProps = {
    isSearchable: true,
    defaultValue: null,
};
