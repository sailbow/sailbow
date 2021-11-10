import React, { FunctionComponent } from 'react';

import {
    InputGroup,
    Input as ChakraInput,
    InputRightElement,
    Tooltip,
    InputProps as ChakraInputProps,
    TextareaProps as ChakraTextareaProps,
    Text,
    Textarea,
    Spinner,
    Box,
} from '@chakra-ui/react';
import { SbErrorCircleIcon } from 'util/Icons';

import 'components/input/Input.scss';

interface Props {
    loading?: boolean;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
    label?: string;
    required?: boolean;
}

interface InputProps extends Props {
    props: ChakraInputProps;
}

export const Input: FunctionComponent<InputProps> = ({
    label,
    field,
    error,
    errorLabel,
    errorIcon,
    props,
    loading,
    required,
}) => {
    return (
        <Box className="sb-input-wrapper">
            {label && (
                <Text fontSize="sm" fontWeight="semibold" className="sb-input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </Text>
            )}
            <InputGroup variant="brand" alignItems="center" className="sb-input">
                <ChakraInput p="0" {...field} {...props} />
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
        </Box>
    );
};

Input.defaultProps = {
    loading: false,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
};

interface TextareaProps extends Props {
    props: ChakraTextareaProps;
}

export const TextArea: FunctionComponent<TextareaProps> = ({
    label,
    field,
    error,
    errorLabel,
    errorIcon,
    props,
    required,
}) => {
    return (
        <Box className="sb-input-wrapper">
            {label && (
                <Text fontSize="sm" fontWeight="semibold" className="sb-input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </Text>
            )}
            <InputGroup variant="brand">
                <Textarea px="0" {...field} {...props} className="sb-input" borderRadius="0" />
                {error ? (
                    <Tooltip label={errorLabel}>
                        <InputRightElement color="brand.error" h="0">
                            {errorIcon}
                        </InputRightElement>
                    </Tooltip>
                ) : null}
            </InputGroup>
        </Box>
    );
};

TextArea.defaultProps = {
    loading: false,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
};
