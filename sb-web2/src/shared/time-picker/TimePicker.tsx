import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import {
    Box,
    Flex,
    Button,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useOutsideClick,
} from '@chakra-ui/react';

import { Input, InputProps } from 'shared/input/Input';

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];

interface ClockProps {
    time: string;
    onDateChange: (time: string) => void;
}

export const Clock: FC<ClockProps> = ({ time, onDateChange }) => {
    const [selectedTime] = useState(time || new Date().toLocaleTimeString());
    const [hour, setHour] = useState<string>(selectedTime.split(':')[0]);
    const [min, setMin] = useState<string>('');
    const [ampm, setAmpm] = useState<string>(selectedTime.split(' ')[1]);

    useEffect(() => {
        const val = -~(parseInt(selectedTime.split(':')[1], 10) / 15) * 15;

        if (val === 60) {
            setMin('00');
        } else {
            setMin(val.toString());
        }
    }, [selectedTime]);

    useEffect(() => {
        onDateChange(`${hour}:${min} ${ampm}`);
    }, [hour, min, ampm, onDateChange]);

    return (
        <Box>
            <Flex w="100%" py="2" justifyContent="space-between" alignItems="center">
                <Flex gap="4" alignItems={'center'} justifyContent="space-between">
                    <Input
                        value={hour}
                        label="Hour"
                        type="number"
                        pattern=""
                        onChange={({ target: { value } }) => {
                            const r = new RegExp('^[1-9]$|^[1][0-2]$').test(value);
                            if (r) setHour(value);
                        }}
                    />
                    <Input
                        value={min}
                        label="Minute"
                        type="number"
                        onChange={({ target: { value } }) => {
                            const r = new RegExp('^([0-5]?[0-9]|)$').test(value);

                            if (r) {
                                setMin(value);
                            }
                        }}
                        onBlur={() => {
                            if (min.length === 1) setMin('0' + min);
                        }}
                    />
                    <Box>
                        <Button
                            size="xs"
                            py="4"
                            variant={ampm === 'AM' ? 'accent' : 'ghost'}
                            colorScheme={ampm === 'AM' ? 'brand' : 'gray'}
                            onClick={() => setAmpm('AM')}
                        >
                            AM
                        </Button>
                        <Button
                            size="xs"
                            py="4"
                            variant={ampm === 'PM' ? 'accent' : 'ghost'}
                            colorScheme={ampm === 'PM' ? 'brand' : 'gray'}
                            onClick={() => setAmpm('PM')}
                        >
                            PM
                        </Button>
                    </Box>
                </Flex>
            </Flex>

            <Flex w="100%" justifyContent="space-between">
                <Stack maxH="260px" overflowY="auto" w="100%" p="2">
                    {HOURS.map((h) => (
                        <Button
                            variant={h === hour ? 'accent' : 'ghost'}
                            colorScheme={h === hour ? 'brand' : 'gray'}
                            key={`hour-${h}`}
                            onClick={() => setHour(h)}
                        >
                            {h}
                        </Button>
                    ))}
                </Stack>
                <Stack maxH="260px" overflowY="auto" w="100%" p="2">
                    {MINUTES.map((m) => (
                        <Button
                            variant={m === min ? 'accent' : 'ghost'}
                            colorScheme={m === min ? 'brand' : 'gray'}
                            key={`mins-${m}`}
                            onClick={() => {
                                setMin(m);
                            }}
                        >
                            {m}
                        </Button>
                    ))}
                </Stack>
            </Flex>
        </Box>
    );
};

interface Props extends InputProps {}

export const TimePicker: FC<Props> = ({ value, onChange, name, ...props }) => {
    const [ev, setEv] = useState<any>();
    const ref = useRef<any>();
    const [pickerOpen, setPickerOpen] = useState<boolean>(false);

    useOutsideClick({
        ref: ref,
        handler: () => {
            if (pickerOpen) setPickerOpen(false);
        },
    });

    return (
        <Popover isLazy lazyBehavior="unmount" isOpen={pickerOpen}>
            <PopoverTrigger>
                <Input {...props} value={value} isReadOnly cursor="pointer" onClick={() => setPickerOpen(true)} />
            </PopoverTrigger>
            <PopoverContent borderWidth="2px" borderRadius="xl" ref={ref}>
                <PopoverBody>
                    <Clock
                        time={value as string}
                        onDateChange={(date: string) => {
                            const event = { target: { value: date, name } as HTMLInputElement };

                            setEv(event);
                        }}
                    />

                    <Flex gap="4" pt="4" pb="2">
                        <Button
                            variant="link"
                            w="100%"
                            onClick={() => {
                                setPickerOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            w="100%"
                            onClick={() => {
                                if (onChange) {
                                    onChange(ev as ChangeEvent<HTMLInputElement>);
                                    setPickerOpen(false);
                                }
                            }}
                        >
                            Apply
                        </Button>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
