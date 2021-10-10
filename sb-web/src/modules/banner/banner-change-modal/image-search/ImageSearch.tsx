import React, { FunctionComponent } from 'react';

import { Box, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { BannerType } from 'contexts/boat/BoatConstants';
import { Search } from 'util/Icons';

interface Props {
    onChange: (type: BannerType, value: string) => void;
}

export const ImageSearch: FunctionComponent<Props> = ({ onChange }) => {
    const onSearch = () => {};
    
    return (
        <Box>
            <InputGroup>
                <Input variant="outline" placeholder="Search images..." />
                <InputRightElement>
                    <Search />
                </InputRightElement>
            </InputGroup>
        </Box>
    );
};
