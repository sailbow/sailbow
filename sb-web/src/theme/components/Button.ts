import { ComponentStyleConfig, theme as ChakraTheme } from '@chakra-ui/react';

export const ButtonStyles: ComponentStyleConfig = {
    defaultProps: {
        colorScheme: 'brand',
    },
    baseStyle: {
        borderRadius: '10px',
        fontWeight: 'semibold',
        borderColor: 'transparent',
        borderWidth: '1px',
        _focus: {
            boxShadow: '0px 0px 2px 1px #b2f5ea',
            borderColor: '#b2f5ea',
            borderWidth: '1px',
        },
    },
    variants: {
        solid: (props: any) => {
            if (props.colorScheme === 'brand') {
                return {
                    ...ChakraTheme.components.Button.variants.solid(props),
                    color: 'brand.dark',
                };
            }
        },
        link: {
            color: 'brand.dark',
        },
        outline: (props: any) => ({
            ...ChakraTheme.components.Button.variants.outline(props),
            borderRadius: '12px',
            color: 'brand.dark',
            borderColor: 'brand.dark',
            borderWidth: '2px',
            _hover: {
                color: 'white',
                borderColor: 'brand.dark',
                backgroundColor: 'brand.dark',
            },
            _active: {
                color: 'white',
                borderColor: 'brand.dark',
                backgroundColor: 'gray.700',
            },
        }),
        icon: (props: any) => {
            return {
                ...ChakraTheme.components.Button.variants.ghost(props),
                color: 'brand.dark',
                _hover: {
                    backgroundColor: 'gray.100',
                },
                _active: {
                    backgroundColor: 'gray.200',
                },
            };
        },
    },
};
