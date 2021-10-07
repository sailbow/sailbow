import React, { FunctionComponent, ReactElement } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';
import { Footer } from 'modules/footer/Footer';

interface Props {
    children: ReactElement | ReactElement[];
    title: string;
    subtitle?: string;
}

export const Base: FunctionComponent<Props> = ({ title, children, subtitle }) => {
    return (
        <>
            <Box p="8" className="container">
                <Heading>{title}</Heading>
                {subtitle && <Text fontWeight="normal">{subtitle}</Text>}
                <Box pt="16">{children}</Box>
            </Box>
            <Footer />
        </>
    );
};

Base.defaultProps = {
    subtitle: '',
};
