import React, { FunctionComponent } from 'react';

import {
    InputGroup,
    InputLeftAddon,
    Input as ChakraInput,
    InputRightElement,
    Tooltip,
    InputProps as ChakraInputProps,
    TextareaProps as ChakraTextareaProps,
    Textarea,
    Spinner,
} from '@chakra-ui/react';
import { ErrorCircle } from 'util/Icons';

import 'components/input/Input.scss';

interface Props {
    loading?: boolean;
    icon?: JSX.Element | null;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
}

interface InputProps extends Props {
    props: ChakraInputProps;
}

export const Input: FunctionComponent<InputProps> = ({ icon, field, error, errorLabel, errorIcon, props, loading }) => {
    return (
        <InputGroup variant="brand" alignItems="center">
            {icon && <InputLeftAddon>{icon}</InputLeftAddon>}
            <ChakraInput {...field} {...props} className="sb-input" />
            {loading && (
                <InputRightElement color="brand.error">
                    <Spinner size="sm" color="brand.dark" />
                </InputRightElement>
            )}
            {error ? (
                <Tooltip label={errorLabel}>
                    <InputRightElement color="brand.error">{errorIcon}</InputRightElement>
                </Tooltip>
            ) : null}
        </InputGroup>
    );
};

Input.defaultProps = {
    loading: false,
    icon: null,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <ErrorCircle />,
};

interface TextareaProps extends Props {
    props: ChakraTextareaProps;
}

export const TextArea: FunctionComponent<TextareaProps> = ({ icon, field, error, errorLabel, errorIcon, props }) => {
    return (
        <InputGroup variant="brand">
            {icon && <InputLeftAddon>{icon}</InputLeftAddon>}
            <Textarea {...field} {...props} className="sb-input" />
            {error ? (
                <Tooltip label={errorLabel}>
                    <InputRightElement color="brand.error">{errorIcon}</InputRightElement>
                </Tooltip>
            ) : null}
        </InputGroup>
    );
};

TextArea.defaultProps = {
    loading: false,
    icon: null,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <ErrorCircle />,
};
