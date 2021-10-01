import { extendTheme, ThemeConfig, theme as ChakraTheme, ComponentDefaultProps } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
});

const fonts = {
    ...ChakraTheme.fonts,
    body: "'Urbanist', sans-serif",
    heading: "'Urbanist', sans-serif",
};

const fontWeights = {
    ...ChakraTheme.fontWeights,
    normal: 500,
    medium: 600,
    semibold: 700,
    bold: 800,
    extrabold: 900,
};

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

const styles = {
    global: {
        body: {
            bg: 'white',
            color: 'gray.600',
        },
    },
};

const components: ComponentDefaultProps = {
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
        },
        variants: {
            link: {
                color: 'gray.600',
            },
            outline: (props: any) => ({
                ...ChakraTheme.components.Button.variants.outline(props),
                color: 'gray.600',
                borderColor: 'gray.600',
                borderWidth: '2px',
                borderRadius: 'xl',
                _hover: {
                    color: 'white',
                    borderColor: 'gray.600',
                    backgroundColor: 'gray.600',
                },
                _active: {
                    color: 'white',
                    borderColor: 'gray.600',
                    backgroundColor: 'gray.700',
                },
            }),
        },
    },
    Input: {
        baseStyle: {},
        defaultProps: {
            focusBorderColor: 'pink.500',
        },
    },
    Textarea: {
        defaultProps: {
            focusBorderColor: 'pink.400',
        },
    },
    Link: {
        variants: {
            primary: () => ({
                color: 'white',
                _hover: {
                    color: 'white',
                },
            }),
            secondary: () => ({
                color: 'gray.200',
                _hover: {
                    color: 'gray.50',
                },
            }),
        },
        defaultProps: {
            variant: 'primary',
        },
    },
    Badge: {
        baseStyle: {
            textTransform: 'none',
            fontWeight: 'normal',
        },
    },
    Avatar: {
        variants: {
            square: () => {
                return {
                    borderRadius: 0,
                };
            },
        },
    },
};

const shadows = {
    // outline: '0 0 0 3px #f98fffCC',
    outline: 'none',
};

export const theme = extendTheme({ config, styles, fonts, fontWeights, breakpoints, components, shadows });
