import { ThemeConfig, extendTheme, withDefaultColorScheme, theme as ChakraTheme } from '@chakra-ui/react';

import { BrandColors, DarkColors } from 'theme/colors/Colors';
import { components } from 'theme/components';

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'sailboat',
};

const fonts = {
    body: "'Plus Jakarta Sans', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
};

const colors = {
    brand: {
        ...BrandColors,
    },
    gray: {
        ...DarkColors,
    },
};

const fontWeights = {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 500,
    medium: 600,
    semibold: 700,
    bold: 800,
    extrabold: 900,
    black: 900,
};

export const bgLight = 'white';
export const bgDark = DarkColors[900];
export const NavbarHeight = '60px';
const shadows = {
    ...ChakraTheme.shadows,
    // lg: '0 0px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    outline: 'none',
}

export const theme = extendTheme(
    {
        config,
        colors,
        fonts,
        components,
        fontWeights,
        shadows,
    },
    withDefaultColorScheme({ colorScheme: 'brand' }),
);
