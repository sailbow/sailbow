import React, { FunctionComponent } from 'react';

import { InputGroup, InputLeftAddon, Input as ChakraInput, InputRightElement, Tooltip } from '@chakra-ui/react';
import { ErrorCircle } from 'util/Icons';

import 'components/input/Input.scss';

interface Props {
    id: string;
    placeholder?: string;
    icon?: JSX.Element;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
}

export const Input: FunctionComponent<Props> = ({ icon, field, error, errorLabel, errorIcon, id, placeholder }) => {
    return (
        <InputGroup variant="brand">
            <InputLeftAddon>{icon}</InputLeftAddon>
            <ChakraInput {...field} id={id} placeholder={placeholder} className="sb-input" />
            {error ? (
                <Tooltip label={errorLabel}>
                    <InputRightElement color="brand.error">{errorIcon}</InputRightElement>
                </Tooltip>
            ) : null}
        </InputGroup>
    );
};

Input.defaultProps = {
    icon: <></>,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <ErrorCircle />,
    placeholder: '',
};
