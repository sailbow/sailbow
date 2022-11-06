import { ComponentStyleConfig } from '@chakra-ui/react';

export const InputStyles: ComponentStyleConfig = {
    baseStyle: {
        _focus: {
            boxShadow: 'none',
            borderColor: 'red.500'
        }
    },
    variants: {
        brand: (props: any) => {
            return {
                field: {
                    ...props.theme.components.Input.variants.outline(props).field,
                    px: '4',
                    py: '6',
                    borderWidth: '2px',
                    _focus: {
                        boxShadow: 'none',
                        borderColor: 'brand.100'
                    }
                },
            };
        },
    },
};
