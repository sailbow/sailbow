import { FC } from 'react';

import { Text } from '@chakra-ui/react';

interface Props {
    label: string;
    required?: boolean;
}

export const Label: FC<Props> = ({ label, required }) => {
    return (
        <Text fontSize="sm" fontWeight="semibold" className="sb-input-label">
            {label}
            {required && <span className="required">*</span>}
        </Text>
    );
};
