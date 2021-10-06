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

const colors = {
    brand: {
        dark: ChakraTheme.colors.gray[600],
        success: ChakraTheme.colors.green[300],
        warning: ChakraTheme.colors.orange[300],
        error: ChakraTheme.colors.red[300],
        500: ChakraTheme.colors.teal[300],
        600: ChakraTheme.colors.teal[400],
        700: ChakraTheme.colors.teal[500],
    },
};

const components: ComponentDefaultProps = {
    Link: {
        baseStyle: {
            color: 'gray.600',
            fontWeight: 'semibold',
        },
    },
    Button: {
        defaultProps: {
            colorScheme: 'brand',
        },
        baseStyle: {
            borderRadius: '16px',
            fontWeight: 'semibold',
        },
        variants: {
            link: {
                color: 'gray.600',
            },
            outline: (props: any) => ({
                ...ChakraTheme.components.Button.variants.outline(props),
                borderRadius: '16px',
                color: 'gray.600',
                borderColor: 'gray.600',
                borderWidth: '2px',
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
        defaultProps: {
            focusBorderColor: 'teal.200',
        },
    },
    Textarea: {
        defaultProps: {
            focusBorderColor: 'TEAL.200',
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
    outline: 'none',
};

export const theme = extendTheme({ config, styles, fonts, fontWeights, breakpoints, components, shadows, colors });
