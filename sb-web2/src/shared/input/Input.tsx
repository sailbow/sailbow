import { forwardRef, FunctionComponent, ReactNode } from 'react';

import {
    InputGroup,
    Input as ChakraInput,
    InputRightElement,
    InputProps as ChakraInputProps,
    TextareaProps as ChakraTextareaProps,
    Textarea,
    Spinner,
    Box,
    Text,
} from '@chakra-ui/react';

import { Label } from './Label';

import './Input.scss';

export interface InputProps extends ChakraInputProps {
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
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
        },
        ref,
    ) => {
        return (
            <Box className={`sb-input-wrapper ${customClass}`} w="100%" ref={ref}>
                {label && <Label label={label} required={required} />}
                <InputGroup variant="brand" alignItems="center" className="sb-input" mt="1">
                    {rightIconButton && (
                        <InputRightElement p="0" color="brand.secondary">
                            {rightIconButton}
                        </InputRightElement>
                    )}

                    <ChakraInput
                        {...field}
                        {...props}
                        disabled={loading}
                        isInvalid={error}
                        borderRadius="lg"
                        errorBorderColor="brand.error"
                    />
                    {loading && (
                        <InputRightElement color="brand.error">
                            <Spinner size="sm" color="brand.dark" />
                        </InputRightElement>
                    )}
                </InputGroup>
                {error && (
                    <Text fontSize="xs" pt="1" color="brand.error" fontWeight="medium">
                        {errorLabel}
                    </Text>
                )}
            </Box>
        );
    },
);

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
            {label && <Label label={label} required={required} />}
            <InputGroup mt="1">
                <Textarea {...field} {...props} className="sb-input" isInvalid={error} errorBorderColor="brand.error" />
            </InputGroup>
            {error && (
                <Text fontSize="xs" pt="1" color="brand.error" fontWeight="medium">
                    {errorLabel}
                </Text>
            )}
        </Box>
    );
};
