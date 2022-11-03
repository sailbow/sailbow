import { FC } from 'react';

import { Text, TextProps } from '@chakra-ui/react';

interface Props extends TextProps {
    label: string;
    required?: boolean;
}

export const Label: FC<Props> = ({ label, required, ...props }) => {
    return (
        <Text fontSize="sm" fontWeight="medium" className="sb-input-label" {...props}>
            {label}
            {required && <span className="required">*</span>}
        </Text>
    );
};
