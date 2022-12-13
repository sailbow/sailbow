import { ComponentStyleConfig } from '@chakra-ui/react';

export const TextareaStyles: ComponentStyleConfig = {
    defaultProps: {
    },
    baseStyle: {
        py: '3',
        px: '8',
        _focus: {
            boxShadow: 'none',
            borderColor: 'red.100',
        }
    },
};
