import { ComponentStyleConfig } from '@chakra-ui/react';

export const InputStyles: ComponentStyleConfig = {
    variants: {
        brand: (props: any) => {
            return {
                field: {
                    ...props.theme.components.Input.variants.outline,
                    backgroundColor: 'transparent',
                    borderTopWidth: '0',
                    borderLeftWidth: '0',
                    borderRightWidth: '0',
                    borderRadius: '0',
                    borderBottomWidth: '2px',
                    fontWeight: 'normal',
                    transition: 'border 0.25s ease-in-out',
                    _hover: {
                        backgroundColor: 'transparent',
                        borderColor: 'brand.secondary',
                    },
                    _focus: {
                        backgroundColor: 'transparent',
                        borderColor: 'brand.secondary',
                    },
                    _invalid: {
                        borderColor: 'brand.error',
                        bg: 'transparent',
                    },
                },
            };
        },
    },
};
