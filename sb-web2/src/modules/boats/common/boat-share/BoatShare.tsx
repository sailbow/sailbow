import { FC } from 'react';

import { Flex, IconButton, Text, Button } from '@chakra-ui/react';

import { SbCopyIcon, SbLinkIcon } from 'shared/icons/Icons';
import { Popover } from 'shared/popover/Popover';

interface Props {
    mode?: 'popover' | 'none';
}

export const BoatShare: FC<Props> = ({ mode }) => {
    const onCopy = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const Info: FC = () => {
        return (
            <Flex alignItems="center" className="sb-boat-share-info">
                <Text fontWeight="normal" pr="4" noOfLines={1}>
                    {window.location.href}
                </Text>
                <Button rightIcon={<SbCopyIcon />} size="sm" colorScheme="gray" onClick={onCopy} flexShrink={0}>
                    Copy
                </Button>
            </Flex>
        );
    };

    return mode === 'popover' ? (
        <Popover
            triggerNode={
                <IconButton aria-label="link-icon" variant="icon" fontSize="2xl">
                    <SbLinkIcon />
                </IconButton>
            }
        >
            <Info />
        </Popover>
    ) : (
        <Info />
    );
};
