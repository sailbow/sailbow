import { ComponentStyleConfig, theme as ChakraTheme } from '@chakra-ui/react';

const OUTLINE_STYLES = {
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
};

export const ButtonStyles: ComponentStyleConfig = {
    defaultProps: {
        colorScheme: 'brand',
    },
    baseStyle: (props: any) => {
        return {
            fontWeight: ChakraTheme.fontWeights.bold,
            borderColor: 'transparent',
            borderWidth: '1px',
            // _focus: {
            //     boxShadow: '0px 0px 2px 1px red',
            //     borderColor: 'red',
            //     borderWidth: '1px',
            // },
        };
    },
    variants: {
        solid: (props: any) => {
            if (props.colorScheme === 'brand') {
                return {
                    ...props.theme.components.Button.variants.solid,
                    color: 'brand.dark',
                    _hover: {
                        bg: 'brand.100',
                    },
                    _active: {
                        bg: 'brand.600',
                    },
                };
            }
        },
        // link: (props: any) => {
        //     let color = 'brand.dark';

        //     return {
        //         color: 'brand.dark',
        //     }
        // },
        outline: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                ...OUTLINE_STYLES,
            };
        },
        social: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                ...OUTLINE_STYLES,
                display: 'flex',
                justifyContent: 'space-between',
            };
        },
        icon: (props: any) => {
            return {
                ...props.theme.components.Button.variants.ghost,
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
