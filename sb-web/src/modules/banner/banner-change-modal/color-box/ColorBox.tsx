import React, { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { BannerType } from 'contexts/boat/BoatConstants';
import { Color } from 'theme/Colors';
import { Checkmark } from 'util/Icons';

import 'modules/banner/banner-change-modal/color-box/ColorBox.scss';

interface ColorBoxProps {
    color: Color;
    selected?: boolean;
    onChange: (type: BannerType, value: string) => void;
}

export const ColorBox: FunctionComponent<ColorBoxProps> = ({ color, selected, onChange }) => {
    return (
        <Box
            bg={color.toString()}
            borderRadius="lg"
            mr="4"
            my="3"
            className={`sb-color-box ${selected ? 'selected' : ''}`}
            onClick={() => {
                onChange(BannerType.Color, color.toString());
            }}
        >
            {selected && (
                <Box className="check">
                    <Checkmark />
                </Box>
            )}
        </Box>
    );
};

ColorBox.defaultProps = {
    selected: false,
};
