import { FunctionComponent } from 'react';

import { Box } from '@chakra-ui/react';

import { BannerType } from 'modules/boats/Boat.Types';
import { Color } from 'theme/colors/Colors';
import { SbCheckIcon } from 'shared/icons/Icons';

import './ColorBox.scss';

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
                    <SbCheckIcon />
                </Box>
            )}
        </Box>
    );
};

ColorBox.defaultProps = {
    selected: false,
};
