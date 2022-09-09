import { ComponentStyleConfig } from '@chakra-ui/react';

import { Color } from 'theme/colors/Colors';

export const LinkStyles: ComponentStyleConfig = {
    baseStyle: (props: any) => {
        return {
            fontWeight: 500,
            color: Color.Teal800,
            _hover: {
                color: 'teal.500',
                textDecoration: 'none',
            },
            _focus: {
                textDecoration: 'none',
            },
        };
    },
};
