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
    cssVarPrefix: 'sailboat',
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
        teal: ChakraTheme.colors.teal[200],
        muted: ChakraTheme.colors.gray[500],
        500: ChakraTheme.colors.teal[200],
        600: ChakraTheme.colors.teal[300],
        700: ChakraTheme.colors.teal[400],
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
            borderRadius: '12px',
            fontWeight: 'semibold',
        },
        variants: {
            solid: (props: any) => {
                if (props.colorScheme === 'brand') {
                    return {
                        ...ChakraTheme.components.Button.variants.solid(props),
                        color: 'brand.dark',
                        _hover: {
                            color: 'white',
                        },
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
        },
    },
    Input: {
        defaultProps: {
            focusBorderColor: 'brand.teal',
        },
        variants: {
            brand: (props: any) => {
                return {
                    field: {
                        ...ChakraTheme.components.Input.variants.filled(props).field,
                        backgroundColor: 'transparent',
                        fontWeight: 'normal',
                        _hover: {
                            backgroundColor: 'gray.50',
                        },
                        _focus: {
                            backgroundColor: 'gray.50',
                        },
                        _invalid: {
                            borderColor: 'none',
                            bg: 'red.50',
                        },
                    },
                    addon: {
                        ...ChakraTheme.components.Input.variants.filled(props).addon,
                        backgroundColor: 'transparent',
                        border: 'none',
                        pl: '0',
                    },
                };
            },
        },
    },
    Textarea: {
        defaultProps: {
            focusBorderColor: 'transparent',
        },
        baseStyle: {
            fontWeight: 'normal',
            _hover: {
                backgroundColor: 'gray.50',
            },
            _focus: {
                backgroundColor: 'gray.50',
            },
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
