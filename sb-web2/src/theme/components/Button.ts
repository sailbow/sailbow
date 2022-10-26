import { ComponentStyleConfig, theme as ChakraTheme } from '@chakra-ui/react';
import { BrandColors } from 'theme/colors/Colors';

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
            fontWeight: ChakraTheme.fontWeights.semibold,
            borderColor: 'transparent',
            borderWidth: '1px',
            // _focus: {
            //     boxShadow: '0px 0px 2px 1px red',
            //     borderColor: 'red',
            //     borderWidth: '1px',
            // },
        };
    },
    sizes: {
        md: (props: any) => {
            return {
                ...props.theme.components.Button.sizes.md,
                py: '5',
            };
        },
    },
    variants: {
        solid: (props: any) => {
            if (props.colorScheme === 'brand') {
                return {
                    ...props.theme.components.Button.variants.solid,
                    color: 'brand.dark',
                    _hover: {
                        bg: 'brand.300',
                    },
                    _active: {
                        bg: 'brand.600',
                    },
                };
            }
        },
        secondary: (props: any) => {
            return {
                ...props.theme.components.Button.variants.solid,
                color: 'brand.dark',
                bg: 'gray.100',
                _hover: {
                    bg: 'gray.200',
                },
                _active: {
                    bg: 'gray.300',
                },
            };
        },
        'menu-link': (props: any) => {
            return {
                color: 'brand.dark',
                _hover: {
                    color: 'brand.800',
                },
            };
        },
        link: (props: any) => {
            return {
                ...props.theme.components.Button.variants.link,
                fontWeight: 700,
                color: BrandColors.dark,
            };
        },
        accent: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                color: 'brand.900',
                bg: 'brand.100',
                borderTopWidth: '2px',
                borderBottomWidth: '2px',
                borderLeftWidth: '2px',
                borderRightWidth: '2px',
                _hover: {
                    bg: 'brand.50',
                },
            };
        },
        outline: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                ...OUTLINE_STYLES,
                borderTopWidth: '2px',
                borderBottomWidth: '2px',
                borderLeftWidth: '2px',
                borderRightWidth: '2px',
            };
        },
        social: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                ...OUTLINE_STYLES,
                display: 'flex',
                justifyContent: 'space-between',
                _loading: {
                    justifyContent: 'center',
                },
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
