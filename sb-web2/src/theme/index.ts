import { ThemeConfig, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

import { BrandColors, DarkColors } from "theme/colors/Colors";
import { components } from "theme/components";

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
        ...DarkColors
    }
};

export const bgLight = "white";
export const bgDark = DarkColors[900];
export const NavbarHeight = "60px";

export const theme = extendTheme(
    {
        config,
        colors,
        fonts,
        components,
    },
    withDefaultColorScheme({ colorScheme: "brand" }),
);
