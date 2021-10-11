import React, { ChangeEvent, FunctionComponent, useState, useCallback } from 'react';

import { Box, Input, InputRightElement, InputGroup, Image } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';

import { BannerType } from 'contexts/boat/BoatConstants';
import { Checkmark, Search } from 'util/Icons';
import { useDebounce } from 'util/Input';
import { ImageSearchEndpoints } from 'util/Endpoints';

import Gallery from 'react-photo-gallery';

import 'modules/banner/banner-change-modal/image-search/ImageSearch.scss';

interface Photo {
    src: string;
    width: number;
    height: number;
    photographer: string;
    photographerUrl: string;
}

interface Props {
    onChange: (type: BannerType, value: string) => void;
}

export const ImageSearch: FunctionComponent<Props> = ({ onChange }) => {
    const [debounce] = useDebounce();
    const [images, setImages] = useState<Photo[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [selected, setSelected] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const onPaginate = async (newPage: number): Promise<void> => {
        setPage(newPage);
        const { data }: AxiosResponse = await axios({
            method: ImageSearchEndpoints.Search.method,
            url: ImageSearchEndpoints.Search.url,
            headers: {
                Authorization: process.env.REACT_APP_PEXELS_API_KEY,
            },
            params: {
                query: searchValue,
                per_page: 10,
                page: newPage,
            },
        });

        const photos: Photo[] = [];

        data.photos.forEach((photo: any) => {
            photos.push({
                src: photo.src.landscape,
                width: 3,
                height: 2,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
            });
        });

        const newImages = [...images];
        newImages.push(...photos);

        setImages(newImages);
    };

    const onSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        debounce(e.target.value, async (value: string) => {
            const resultsDiv = document.getElementById('img-results');
            if (resultsDiv) resultsDiv.scrollTo({ top: 0, behavior: 'smooth' });

            setSearchValue(value);
            setPage(1);
            setImages([]);

            if (value) {
                const { data }: AxiosResponse = await axios({
                    method: ImageSearchEndpoints.Search.method,
                    url: ImageSearchEndpoints.Search.url,
                    headers: {
                        Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                    },
                    params: {
                        query: value,
                        per_page: 10,
                        page: 1,
                    },
                });

                const photos: Photo[] = [];

                data.photos.forEach((photo: any) => {
                    photos.push({
                        src: photo.src.landscape,
                        width: 3,
                        height: 2,
                        photographer: photo.photographer,
                        photographerUrl: photo.photographer_url,
                    });
                });

                setImages(photos);
            }
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
                        objectFit="cover"
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
            <Box
                id="img-results"
                maxH="360px"
                overflow="auto"
                onScroll={(e: any) => {
                    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
                    if (bottom) {
                        onPaginate(page + 1);
                    }
                }}
            >
                <Gallery renderImage={imageRenderer} photos={images} />
            </Box>
        </Box>
    );
};
