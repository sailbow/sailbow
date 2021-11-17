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
            _active: {
                color: 'brand.700',
            },
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
            icon: (props: any) => {
                console.log(props);
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
    },
    Input: {
        variants: {
            brand: (props: any) => {
                return {
                    field: {
                        ...ChakraTheme.components.Input.variants.outline(props).field,
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
                            borderColor: 'brand.muted',
                        },
                        _focus: {
                            backgroundColor: 'transparent',
                            borderColor: 'brand.muted',
                        },
                        _invalid: {
                            borderColor: 'brand.error',
                            bg: 'transparent',
                        },
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
                borderColor: 'brand.muted',
            },
            _focus: {
                backgroundColor: 'transparent',
                borderColor: 'brand.muted',
            },
            _invalid: {
                borderColor: 'brand.error',
                bg: 'transparent',
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
    Menu: {
        parts: ['list', 'item', 'divider'],
        baseStyle: {
            list: {
                border: 'none',
                boxShadow: 'lg',
                borderRadius: 'lg',
            },
            divider: {
                opacity: 0.1,
            },
            groupTitle: {
                paddingTop: '0.5rem',
            },
            item: {
                fontWeight: 'normal',
                lineHeight: 'normal',
                padding: '0.75rem',
            },
        },
    },
    Popover: {
        variants: {
            brand: {
                popper: {
                    maxWidath: 'unset',
                    width: 'unset',
                    boxShadow: 'lg',
                    border: 'transparent',
                    borderRadius: 'lg',
                },
            },
        },
    },
};

const shadows = {
    ...ChakraTheme.shadows,
    outline: 'none',
    lg: '0 0px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export const theme = extendTheme({ config, styles, fonts, fontWeights, breakpoints, components, shadows, colors });
