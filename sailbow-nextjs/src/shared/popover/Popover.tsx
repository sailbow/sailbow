import { FC, ReactNode } from 'react';

import { Popover as ChakraPopover, PopoverTrigger, PopoverContent, PopoverBody, PopoverProps } from '@chakra-ui/react';

interface Props extends PopoverProps {
    triggerNode: ReactNode;
    children: ReactNode;
}

export const Popover: FC<Props> = ({ triggerNode, children, ...props }) => {
    return (
        <ChakraPopover variant="brand" isLazy lazyBehavior="unmount" {...props}>
            <PopoverTrigger>{triggerNode}</PopoverTrigger>
            <PopoverContent borderRadius="lg" w="100%">
                <PopoverBody p="2">{children}</PopoverBody>
            </PopoverContent>
        </ChakraPopover>
    );
};
