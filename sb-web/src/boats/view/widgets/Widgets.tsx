import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import GridLayout, { Layout } from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';

import 'boats/view/widgets/Widgets.scss';
import { SbDragIcon } from 'util/icons/Icons';
import { useLongPress } from 'util/hooks/Input';

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
        const currentLayoutIdx = layout.findIndex((l) => l.i === id);

        if (currentLayoutIdx !== -1) {
            const newLayouts = [...layout];

            newLayouts[currentLayoutIdx].h = 3;
            setLayout([...newLayouts]);
            console.log(layout);
        }
    };

    const onDragStart = () => {
        setIsDraggable(true);
    };

    const onDragEnd = () => {
        setIsDraggable(false);
    };

    const backspaceLongPress = useLongPress(() => {
        onDragStart();
    }, 500);

    return (
        <>
            <SizeMe>
                {({ size }) => (
                    <GridLayout
                        className="sb-widgets"
                        cols={12}
                        width={size.width || 900}
                        layout={layout}
                        isResizable={false}
                        isDraggable={isDraggable}
                        onDragStop={onDragEnd}
                        onLayoutChange={(e) => {
                            console.log(e);
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
                                className="sb-widget"
                                overflow="auto"
                                {...backspaceLongPress}
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
