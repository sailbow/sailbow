import { ComponentStyleConfig, theme as ChakraTheme } from '@chakra-ui/react';

import { BrandColors } from 'theme/colors/Colors';

export const ButtonStyles: ComponentStyleConfig = {
    defaultProps: {
        colorScheme: 'brand',
    },
    baseStyle: () => {
        return {
            fontWeight: ChakraTheme.fontWeights.semibold,
            borderColor: 'transparent',
            borderWidth: '2px',
        };
    },
    sizes: {
        sm: (props: any) => {
            return {
                ...props.theme.components.Button.sizes.sm,
                px: '4',
                py: '5',
            };
        },
        md: (props: any) => {
            return {
                ...props.theme.components.Button.sizes.md,
                px: '8',
                py: '6',
            };
        },
    },
    variants: {
        solid: (props: any) => {
            if (props.colorScheme === 'brand') {
                return {
                    ...props.theme.components.Button.variants.solid,

                    color: 'brand.dark',
                    bg: 'brand.primary',
                    _hover: {
                        bg: 'brand.300',
                    },
                    _active: {
                        bg: 'brand.500',
                    },
                };
            }
        },
        outline: (props: any) => {
            return {
                ...props.theme.components.Button.variants.outline,
                borderWidth: '2px',
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
                color: 'brand.dark',
                bg: `${props.colorScheme}.100`,
                borderTopWidth: '2px',
                borderBottomWidth: '2px',
                borderLeftWidth: '2px',
                borderRightWidth: '2px',
                _hover: {
                    bg: `${props.colorScheme}.200`,
                },
                _active: {
                    bg: `${props.colorScheme}.300`,
                },
            };
        },
        icon: (props: any) => {
            return {
                ...props.theme.components.Button.variants.ghost,
                px: '8',
                py: '6',
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
