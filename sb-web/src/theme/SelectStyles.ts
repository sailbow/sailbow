import { theme } from 'theme/ChakraTheme';
import { StylesConfig, ControlProps } from 'react-select';
import { CSSObject } from '@emotion/react';

export const customStyles: StylesConfig<any, true> = {
    control: (provided: CSSObject, state: ControlProps<any, true>): CSSObject => {
        return {
            ...provided,
            '&:hover': {
                border: `1px solid ${theme.colors.teal[200]}`,
            },
            outline: '0 0 0 3px #f98fffCC',
            boxSizing: 'border-box',
            border: state.isFocused ? `1px solid ${theme.colors.teal[300]}` : `1px solid ${theme.colors.gray[200]}`,
            boxShadow: 'none',
            color: 'gray.600',
            cursor: 'pointer',
            fontWeight: 'normal',
            borderRadius: theme.radii.md,
        };
    },
    menu: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            border: 'none',
            boxShadow: '0 0 5px #efefef',
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
    indicatorsContainer: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            cursor: 'pointer',
        };
    },
    placeholder: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            color: theme.colors.gray[400],
        };
    },
    // valueContainer: (provided: CSSObject, state: ControlProps<any, true>): CSSObject => {
    //     return {
    //         ...provided,
    //         padding: state.hasValue ? '0 8px' : '0 16px',
    //     };
    // },
};
