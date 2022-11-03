import { ComponentStyleConfig } from '@chakra-ui/react';

export const SkeletonStyles: ComponentStyleConfig = {
    defaultProps: {
        startColor: 'gray.100',
        endColor: 'gray.300',

    },
    baseStyle: (props: any) => {
        return {
            borderRadius: '3xl'
        }
    }
};
