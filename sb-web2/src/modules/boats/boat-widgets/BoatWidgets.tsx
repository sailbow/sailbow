import React, { FunctionComponent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Flex, Text, IconButton } from '@chakra-ui/react';

import { SbDragIcon } from 'shared/icons/Icons';

import './Widgets.scss';

export const Widgets: FunctionComponent = () => {
    const [isDraggable, setIsDraggable] = useState<boolean>(false);

    return (
        <>
            All widgets go here
            {/* <SizeMe>
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
            </SizeMe> */}
        </>
    );
};
