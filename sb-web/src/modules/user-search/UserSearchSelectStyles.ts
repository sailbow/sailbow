import { theme } from 'theme/ChakraTheme';
import { StylesConfig, ControlProps } from 'react-select';
import { CSSObject } from '@emotion/react';

export const customStyles: StylesConfig<any, true> = {
    container: (provided: CSSObject, state: any): CSSObject => {
        return {
            ...provided,
            transition: 'all 0.2s ease-in-out',
            width: '100%',
            border: `1px solid ${theme.colors.gray[200]}`,
            borderTop: '0',
            borderLeft: '0',
            borderRight: '0',
            borderRadius: '0',
            paddingLeft: '24px',
            borderColor: state.isFocused ? theme.colors.brand.muted : theme.colors.gray[200],
            '&:hover': {
                borderColor: theme.colors.brand.muted,
            },
        };
    },
    control: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
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
    menu: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            border: 'none',
            boxShadow: '0 0 5px #efefef',
            width: 'auto',
        };
    },
    input: (provided: CSSObject, state: any): CSSObject => {
        return {
            ...provided,
            color: theme.colors.teal,
            borderColor: state.isFocused ? theme.colors.brand.dark : theme.colors.gray[200],
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
    valueContainer: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            padding: '0',
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
    placeholder: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            color: theme.colors.gray[400],
        };
    },
    noOptionsMessage: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            padding: 0,
            color: 'brand.dark',
        };
    },
};
