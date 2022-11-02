import { FC, useState } from 'react';

import { Flex, IconButton, Button } from '@chakra-ui/react';

import { SbCheckIcon, SbCopyIcon, SbLinkIcon } from 'shared/icons/Icons';
import { Popover } from 'shared/popover/Popover';
import { Input } from 'shared/input/Input';

interface Props {
    mode?: 'popover' | 'none';
}

export const BoatShare: FC<Props> = ({ mode }) => {
    const [copy, setCopy] = useState<boolean>(false);
    const [time, setTime] = useState<NodeJS.Timer | null>(null);

    const onCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopy(true);

        if (!time)
            setTime(
                setTimeout(() => {
                    setCopy(false);
                    setTime(null);
                }, 2000),
            );
    };

    const Info: FC = () => {
        return (
            <Flex pb="2" alignItems="center" className="sb-boat-share-info" gap="2">
                <Input
                    value={window.location.href}
                    isReadOnly
                    rightIconButton={
                        <IconButton
                            aria-label="copy-link"
                            colorScheme="gray"
                            variant="ghost"
                            onClick={onCopy}
                            icon={copy ? <SbCheckIcon color="green" /> : <SbCopyIcon />}
                        />
                    }
                />
            </Flex>
        );
    };

    return mode === 'popover' ? (
        <Popover
            triggerNode={
                <IconButton aria-label="link-icon" variant="icon" fontSize="lg" size="sm">
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
