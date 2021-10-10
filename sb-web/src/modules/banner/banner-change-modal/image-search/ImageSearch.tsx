import React, { ChangeEvent, FunctionComponent, useState, useCallback } from 'react';

import { Box, Input, InputRightElement, InputGroup, Image } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';

import { BannerType } from 'contexts/boat/BoatConstants';
import { Checkmark, Search } from 'util/Icons';
import { useDebounce } from 'util/Input';
import { ImageSearchEndpoints } from 'util/Endpoints';

import Gallery from 'react-photo-gallery';

import 'modules/banner/banner-change-modal/image-search/ImageSearch.scss';

interface Props {
    onChange: (type: BannerType, value: string) => void;
}

export const ImageSearch: FunctionComponent<Props> = ({ onChange }) => {
    const [debounce] = useDebounce();
    const [images, setImages] = useState<any[]>([]);
    const [selected, setSelected] = useState<string>('');

    const onSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        debounce(e.target.value, async (value: string) => {
            const { data }: AxiosResponse = await axios({
                method: ImageSearchEndpoints.Search.method,
                url: ImageSearchEndpoints.Search.url,
                headers: {
                    Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                },
                params: {
                    query: value,
                    per_page: 30,
                },
            });

            const photos: any[] = [];
            data.photos.forEach((photo: any) => {
                photos.push({ src: photo.src.landscape, width: 3, height: 2 });
            });

            setImages(photos);
        });
    };

    const imageRenderer = useCallback(
        (props): JSX.Element => {
            const onSelect = () => {
                setSelected(props.photo.src);
                onChange(BannerType.Link, props.photo.src);
            };

            return (
                <Box key={props.index} pos="relative" className="gallery-box">
                    <Image
                        borderRadius="md"
                        src={props.photo.src}
                        onClick={() => onSelect()}
                        height={props.photo.height}
                        width={props.photo.width}
                        style={{ margin: '2px', display: 'block' }}
                        className={`${selected === props.photo.src ? 'selected' : ''}`}
                    />
                    {selected === props.photo.src && (
                        <Box className="check">
                            <Checkmark />
                        </Box>
                    )}
                </Box>
            );
        },
        [selected, onChange],
    );

    return (
        <Box className="sb-image-search">
            <InputGroup mb="2">
                <Input variant="outline" placeholder="Search images..." onChange={onSearch} />
                <InputRightElement>
                    <Search />
                </InputRightElement>
            </InputGroup>
            <Box maxH="360px" overflow="auto">
                <Gallery renderImage={imageRenderer} photos={images} />
            </Box>
        </Box>
    );
};
