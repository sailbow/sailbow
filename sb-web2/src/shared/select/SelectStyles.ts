import { StylesConfig, ControlProps } from 'react-select';
import { CSSObject } from '@emotion/react';

import { theme } from 'theme';

export const customStyles: StylesConfig<any, true> = {
    container: (provided: CSSObject) => {
        return {
            ...provided,
            width: '100%',
        };
    },
    control: (provided: CSSObject, state: ControlProps<any, true>): CSSObject => {
        return {
            ...provided,
            '&:hover': {
                border: `2px solid ${theme.colors.brand.dark}`,
            },
            outline: '0 0 0 3px #f98fffCC',
            boxSizing: 'border-box',
            border: state.isFocused ? `2px solid ${theme.colors.brand.dark}` : `2px solid ${theme.colors.gray[200]}`,
            boxShadow: 'none',
            color: 'gray.600',
            cursor: 'pointer',
            fontWeight: 'normal',
            width: '128px',
            borderRadius: theme.radii.md,
        };
    },
    groupHeading: (provided: CSSObject): CSSObject => {
        return {
            ...provided,
            display: 'none',
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
        const { data } = state;

        return {
            ...provided,
            background: 'white',
            color: 'gray.600',
            cursor: 'pointer',
            fontWeight: 'normal',
            '&:hover': {
                backgroundColor: data.color ? `${theme.colors.gray[100]} !important` : 'none',
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
            fontWeight: 'normal',
            color: theme.colors.gray[400],
        };
    },
};
