import React, { ChangeEvent, FunctionComponent, useState, useCallback } from 'react';

import { Box, Input, InputGroup, Image, Flex, Spinner, Text, InputLeftAddon } from '@chakra-ui/react';
import Gallery from 'react-photo-gallery';

import { useBoat } from 'boats/Boat.Store';
import { BannerType, Photo } from 'boats/Boat.Types';
import { SbCheckIcon, SbSearchIcon } from 'util/icons/Icons';
import { useDebounce } from 'util/hooks/Input';

import 'boats/components/banner/banner-change-modal/image-search/ImageSearch.scss';

interface Props {
    onChange: (type: BannerType, value: string) => void;
}

export const ImageSearch: FunctionComponent<Props> = ({ onChange }) => {
    const [, { getImages }] = useBoat();
    const [debounce] = useDebounce();
    const [images, setImages] = useState<Photo[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [selected, setSelected] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const onPaginate = async (newPage: number): Promise<void> => {
        setPage(newPage);
        setLoading(true);
        const photos = await getImages(searchValue, newPage);
        const newImages = [...images];

        newImages.push(...photos);
        setLoading(false);
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
                setLoading(true);
                const photos = await getImages(value, 1);

                setLoading(false);
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
                        onClick={onSelect}
                        height={props.photo.height}
                        width={props.photo.width}
                        style={{ margin: '2px', display: 'block' }}
                        className={`${selected === props.photo.src ? 'selected' : ''}`}
                    />
                    {selected === props.photo.src && (
                        <Box className="check">
                            <SbCheckIcon />
                        </Box>
                    )}
                </Box>
            );
        },
        [selected, onChange],
    );

    return (
        <Box className="sb-image-search">
            <InputGroup variant="brand">
                <InputLeftAddon p="0" position="absolute">
                    <SbSearchIcon />
                </InputLeftAddon>
                <Input paddingLeft="24px" placeholder="Search images..." onChange={onSearch} fontWeight="normal" />
            </InputGroup>
            <Text fontSize="xx-small" textAlign="right" pt="1">
                Powered by Unsplash
            </Text>
            <Box
                mt="2"
                id="img-results"
                h="360px"
                overflow="auto"
                onScroll={(e: any) => {
                    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
                    if (bottom) {
                        onPaginate(page + 1);
                    }
                }}
            >
                {loading && (
                    <Flex justifyContent="center" alignItems="center" h="100%">
                        <Spinner />
                    </Flex>
                )}
                <Gallery renderImage={imageRenderer} photos={images} />
            </Box>
        </Box>
    );
};
