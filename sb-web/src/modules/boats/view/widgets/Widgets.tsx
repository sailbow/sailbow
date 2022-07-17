import React, { FunctionComponent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import GridLayout, { Layout } from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';

import { SbDragIcon } from 'util/icons/Icons';

import './Widgets.scss';

export const Widgets: FunctionComponent = () => {
    const [isDraggable, setIsDraggable] = useState<boolean>(false);
    const [layout, setLayout] = useState<Layout[]>([]);

    const widgets = useMemo(
        () => [
            {
                id: 'widget-date',
                name: 'Date',
                layout: { i: 'widget-date', x: 0, y: 0, w: 12, h: 1, minW: 12, minH: 1 },
            },
            {
                id: 'widget-time',
                name: 'Time',
                layout: { i: 'widget-time', x: 0, y: 1, w: 12, h: 1, minW: 12, minH: 1 },
            },
            {
                id: 'widget-location',
                name: 'Location',
                layout: { i: 'widget-location', x: 0, y: 3, w: 12, h: 1, minW: 12, minH: 1 },
            },
        ],
        [],
    );

    const getLayout = useCallback(() => {
        const gridLayouts: Layout[] = [];

        widgets.forEach((widget) => {
            gridLayouts.push(widget.layout);
        });

        setLayout([...gridLayouts]);
    }, [widgets]);

    useEffect(() => {
        getLayout();
    }, [getLayout]);

    const toggleCollapse = (id: string) => {
        const currentLayouts = layout.map((l) => ({ ...l }));
        const currentLayoutIdx = currentLayouts.findIndex((l) => l.i === id);
        const currentH = currentLayouts[currentLayoutIdx].h;

        if (currentH === 3) {
            currentLayouts[currentLayoutIdx].h = 1;
        } else {
            currentLayouts[currentLayoutIdx].h = 3;
        }

        setLayout([...currentLayouts]);
    };

    const onDragStart = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDraggable(true);
    };

    const onDragEnd = () => {
        setIsDraggable(false);
    };

    return (
        <>
            <SizeMe>
                {({ size }) => (
                    <GridLayout
                        className="sb-widgets"
                        cols={12}
                        rowHeight={56}
                        width={size.width || 900}
                        layout={layout}
                        isResizable={false}
                        isDraggable={isDraggable}
                        onDragStop={onDragEnd}
                        onLayoutChange={(e: Layout[]) => {
                            setLayout(e);
                        }}
                    >
                        {widgets.map((widget) => (
                            <Box
                                borderRadius="lg"
                                boxShadow="lg"
                                key={widget.id}
                                onClick={() => {
                                    toggleCollapse(widget.id);
                                }}
                                px="4"
                                py="2"
                                w="100%"
                                className={`sb-widget ${isDraggable ? 'on-drag' : ''}`}
                                overflow="auto"
                            >
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Text>{widget.name}</Text>
                                    <IconButton
                                        onClick={onDragStart}
                                        onMouseOver={onDragStart}
                                        onMouseLeave={onDragEnd}
                                        size="sm"
                                        aria-label="move"
                                        icon={<SbDragIcon />}
                                        variant="ghost"
                                        color="brand.muted"
                                        fontSize="2xl"
                                        cursor="move"
                                        mr="-2"
                                    />
                                </Flex>
                            </Box>
                        ))}
                    </GridLayout>
                )}
            </SizeMe>
        </>
    );
};
