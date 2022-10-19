import { FunctionComponent, ReactNode } from 'react';

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
    InputLeftAddon,
    IconButton,
} from '@chakra-ui/react';
import { SbErrorCircleIcon } from 'shared/icons/Icons';

import './Input.scss';

interface InputProps extends ChakraInputProps {
    loading?: boolean;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
    label?: string;
    required?: boolean;
    customClass?: string;
    leftIcon?: ReactNode;
    rightIconButton?: ReactNode;
}

interface TextareaProps extends ChakraTextareaProps {
    loading?: boolean;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
    label?: string;
    required?: boolean;
    customClass?: string;
}

export const Input: FunctionComponent<InputProps> = ({
    label,
    field,
    error,
    errorLabel,
    errorIcon,
    loading,
    required,
    customClass,
    leftIcon,
    rightIconButton,
    ...props
}) => {
    return (
        <Box className={`sb-input-wrapper ${customClass}`} w="100%">
            {label && (
                <Text fontSize="sm" fontWeight="semibold" className="sb-input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </Text>
            )}
            <InputGroup variant="brand" alignItems="center" className="sb-input">
                <InputLeftAddon position="absolute" p="0" color="brand.secondary">
                    {leftIcon}
                </InputLeftAddon>
                {rightIconButton && (
                    <InputRightElement p="0" color="brand.secondary">
                        <IconButton aria-label="input-right-element" variant="icon" fontSize="xl" size="sm">
                            {rightIconButton}
                        </IconButton>
                    </InputRightElement>
                )}

                <ChakraInput p="0" pl={leftIcon ? '24px' : '0'} {...field} {...props} />
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
    loading: undefined,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
    customClass: '',
};

export const TextArea: FunctionComponent<TextareaProps> = ({
    label,
    field,
    error,
    errorLabel,
    errorIcon,
    required,
    customClass,
    ...props
}) => {
    return (
        <Box className={`sb-input-wrapper ${customClass}`}>
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
    loading: undefined,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
    customClass: '',
};
