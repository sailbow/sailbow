import { FC, useEffect, useState } from 'react';

import { Box, Button, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import Select, {
    components,
    StylesConfig,
    ControlProps,
    GroupBase,
    MenuProps,
    OptionProps,
    MultiValueRemoveProps,
    DropdownIndicatorProps,
    LoadingIndicatorProps,
    SingleValue,
    MultiValue,
    ValueContainerProps,
} from 'react-select';

import { SbChevronDownIcon, SbCloseIcon } from 'shared/icons/Icons';
import { BrandColors, Color } from 'theme/colors/Colors';

export interface OptionType {
    label: string;
    value: string | number;
}

export type OptionState = SingleValue<OptionType> | MultiValue<OptionType>;

interface Props {
    options: OptionType[];
    isMulti?: boolean;
    placeholder?: string;
    onChange?: (value: OptionState) => void;
    selectedValues?: OptionState;
    isLoading?: boolean;
    isRequired?: boolean;
    label?: string;
    error?: string;
    allowDeselectInSingleMode?: boolean;
    helperText?: string;
    isDisabled?: boolean;
}

/**
 * Import: OptionState, OptionType
 * Usage: <CustomSelect options={options} isMulti selectedValues={values} onChange={setValues} />
 */

export const CustomSelect: FC<Props> = ({
    options,
    placeholder,
    isMulti = false,
    selectedValues = null,
    isLoading,
    isRequired,
    label,
    error,
    allowDeselectInSingleMode = true,
    helperText,
    isDisabled,
    onChange,
}) => {
    const [selected, setSelected] = useState<OptionState | null>(selectedValues);
    const customStyles: StylesConfig<OptionType, typeof isMulti> = {
        container: (base: CSSObject, props: any) => ({
            ...base,
            width: '100%',
            transition: 'all 0.2s ease-in-out',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: '0',
            outline: 'none',
            paddingLeft: '16px',
            cursor: props.isDisabled ? 'not-allowed' : 'pointer',
            borderColor: props.isFocused ? BrandColors.secondary : BrandColors['border-light'],
            ':hover': {
                borderColor: BrandColors.secondary,
            },
        }),
        control: (base: CSSObject): CSSObject => {
            return {
                ...base,
                transition: 'all 0.2s ease-in-out',
                backgroundColor: 'transparent',
                outline: '0 0 0 3px #f98fffCC',
                boxSizing: 'border-box',
                boxShadow: 'none',
                color: 'gray.600',
                cursor: 'text',
                fontWeight: 'normal',
                border: 'none',
            };
        },

        dropdownIndicator: (provided: CSSObject): CSSObject => {
            return {
                ...provided,
                display: 'none',
            };
        },
        indicatorSeparator: (provided: CSSObject): CSSObject => {
            return {
                ...provided,
                display: 'none',
                opacity: '0',
            };
        },
        option: (base: CSSObject, props: OptionProps<OptionType, boolean, GroupBase<OptionType>>) => ({
            ...base,
            background: props.isSelected ? BrandColors['300'] : 'white',
            color: props.isSelected ? 'white' : BrandColors.dark,
            ':hover': {
                background: !props.isSelected ? 'none' : BrandColors['100'],
            },
            ':focus': {
                background: BrandColors.primary,
            },
        }),
        placeholder: (base: CSSObject) => ({
            ...base,
            color: Color.Gray400,
        }),
        menu: (base: CSSObject, props: MenuProps<OptionType, boolean, GroupBase<OptionType>>) => ({
            ...base,
            border: 'none',
            boxShadow: '0 0 5px #efefef',
            width: 'auto',
        }),
        multiValue: (base: CSSObject) => ({
            ...base,
            borderRadius: '16px',
            backgroundColor: BrandColors[50],
            fontWeight: '600',
            border: `1px solid ${BrandColors.Primary}`,
        }),
        multiValueRemove: (base: CSSObject) => ({
            ...base,
            borderRadius: '16px',
        }),
        noOptionsMessage: (provided: CSSObject): CSSObject => {
            return {
                ...provided,
                display: 'none',
            };
        },
    };

    const CustomOption: FC<OptionProps<OptionType, typeof isMulti, GroupBase<OptionType>>> = ({
        children,
        isSelected,
        ...innerProps
    }) => {
        return (
            <components.Option isSelected={isSelected} {...innerProps}>
                <Flex justifyContent="space-between" alignItems="center">
                    {children}
                </Flex>
            </components.Option>
        );
    };

    const MultiValueRemove: FC<MultiValueRemoveProps<OptionType, boolean, GroupBase<OptionType>>> = ({
        ...innerProps
    }) => {
        return (
            <components.MultiValueRemove {...innerProps}>
                <SbCloseIcon width="10pt" />
            </components.MultiValueRemove>
        );
    };

    const DropdownIndicator: FC<DropdownIndicatorProps<OptionType, boolean, GroupBase<OptionType>>> = ({
        ...innerProps
    }) => {
        return (
            <components.DropdownIndicator {...innerProps}>
                <SbChevronDownIcon width="16pt" color={BrandColors.SecondaryDark} />
            </components.DropdownIndicator>
        );
    };

    const LoadingIndicator: FC<LoadingIndicatorProps<OptionType, boolean, GroupBase<OptionType>>> = ({
        innerProps,
    }) => {
        return <Spinner color={BrandColors.Primary} size="sm" {...innerProps} />;
    };

    const MultiSelectChip: FC<{ label: string }> = ({ label }) => {
        return (
            <Flex
                justifyContent="space-between"
                alignItems="center"
                border={`1px solid ${BrandColors.Primary}`}
                bg="brand.50"
            >
                <Text pr="1" pl="1.5" fontSize="xs" fontWeight="600" py="0.5">
                    {label}
                </Text>
                <Box
                    _hover={{ bg: 'red.100', color: 'brand.Error' }}
                    h="100%"
                    px="1"
                    fontSize="sm"
                    onClick={() => {
                        const newSelectedOptions = (selected as OptionType[]).filter((s) => s.label !== label);

                        setSelected([...newSelectedOptions]);
                        if (onChange) onChange(newSelectedOptions);
                    }}
                >
                    <Icon>
                        <SbCloseIcon />
                    </Icon>
                </Box>
            </Flex>
        );
    };

    useEffect(() => {
        setSelected(selectedValues);
    }, [selectedValues]);

    const onClear = () => {
        setSelected(null);
        if (onChange) onChange(null);
    };

    const Error: FC = () => {
        return error ? (
            <Text color={BrandColors.Error} fontSize="xs" pt="1" fontWeight="600">
                {error}
            </Text>
        ) : (
            <></>
        );
    };

    return (
        <Box w="100%">
            <Box mb="2">
                {/* {label && (
                    <Label>
                        {label}{' '}
                        {isRequired && (
                            <Text as="span" color="brand.Error">
                                *
                            </Text>
                        )}
                    </Label>
                )} */}

                {helperText && (
                    <Text fontSize="xs" fontWeight="500" color={BrandColors.SecondaryDark}>
                        {helperText}
                    </Text>
                )}
            </Box>
            <Select
                isDisabled={isDisabled}
                controlShouldRenderValue={isMulti ? false : true}
                closeMenuOnSelect={isMulti ? false : true}
                hideSelectedOptions={false}
                options={options}
                isMulti={isMulti}
                isLoading={isLoading}
                placeholder={isLoading ? 'Loading options...' : placeholder}
                components={{
                    Option: CustomOption,
                    IndicatorSeparator: null,
                    MultiValueRemove,
                    ClearIndicator: undefined,
                    LoadingIndicator,
                    DropdownIndicator,
                }}
                value={selected}
                onChange={(options) => {
                    if (onChange) {
                        onChange(options);
                    }

                    setSelected(options);

                    if (!isMulti && allowDeselectInSingleMode) {
                        if (selected && (options as OptionType).label === (selected as OptionType).label) {
                            onClear();
                        }
                    }
                }}
                styles={customStyles}
            />

            {/* {selected && isMulti && (
                <Box p="1">
                    <Error />
                    <Flex justifyContent="space-between" w="100%">
                        <Text fontSize="xs" color="brand.SecondaryDark" fontWeight="500">
                            {(selected as OptionType[]).length} selected
                        </Text>
                        <Button variant="link" fontWeight="500" size="xs" onClick={onClear}>
                            Clear all
                        </Button>
                    </Flex>

                    <Flex gap="2" mt="2" flexWrap="wrap">
                        {(selected as OptionType[]).map((value) => (
                            <MultiSelectChip key={value.label} label={value.label} />
                        ))}
                    </Flex>
                </Box>
            )}

            {!isMulti && <Error />} */}
        </Box>
    );
};
