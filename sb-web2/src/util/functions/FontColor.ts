import { FastAverageColor } from 'fast-average-color';

export const FAC = new FastAverageColor();

export const getFontColor = async (img: string) => {
    const { value: [r, g, b] } = await FAC.getColorAsync(img);

    return ((r * 299 + g * 587 + b * 114) / 1000 > 220 ? 'black' : 'white')
};
