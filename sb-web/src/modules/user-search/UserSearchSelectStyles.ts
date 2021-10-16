import { theme } from 'theme/ChakraTheme';
import { StylesConfig, ControlProps } from 'react-select';
import { CSSObject } from '@emotion/react';

export const customStyles: StylesConfig<any, true> = {
    container: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            transition: 'all 0.2s ease-in-out',
            width: '100%',
        };
    },
    control: (provided: CSSObject, state: ControlProps<any, true>): CSSObject => {
        return {
            ...provided,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: theme.colors.gray[50],
            },
            backgroundColor: state.isFocused ? theme.colors.gray[50] : 'none',
            outline: '0 0 0 3px #f98fffCC',
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: 'none',
            color: 'gray.600',
            cursor: 'text',
            fontWeight: 'normal',
            borderRadius: theme.radii.md,
        };
    },
    menu: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            border: 'none',
            boxShadow: '0 0 5px #efefef',
            width: 'auto',
        };
    },
    input: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            color: theme.colors.teal,
        };
    },
    option: (provided: CSSObject, state: any): CSSObject => {
        return {
            ...provided,
            background: 'white',
            color: 'gray.600',
            cursor: 'pointer',
            width: 'auto',
            '&:hover': {
                background: state.isSelected ? 'none' : theme.colors.teal[100],
            },
        };
    },

    multiValueRemove: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            cursor: 'pointer',
            color: theme.colors.black,
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
        };
    },
    placeholder: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            color: theme.colors.gray[400],
        };
    },
};
