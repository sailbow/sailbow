import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { useBoat } from 'modules/boats/Boat.Store';
import { WidgetData } from 'modules/boats/Boat.Types';
import { DateWidgetSettings } from 'modules/boats/boat-modules/modules/date/DateWidgetSettings';
import { BoatWidget, WidgetProps } from 'modules/boats/common/boat-widget/BoatWidget';
import { Input } from 'shared/input/Input';
import { Poll } from 'shared/poll/Poll';

export interface DateWidgetData extends WidgetData {
    startDate: string;
    endDate?: string;
}

interface Props extends WidgetProps {
    data: DateWidgetData[];
}

export const DateWidget: FC<Props> = ({ id, name, loading, data, mode }) => {
    const [widgetData, setWidgetData] = useState<DateWidgetData[]>(data);
    const [optionsCounter, setOptionsCounter] = useState<number>(0);
    const [formError, setFormError] = useState<boolean>();
    const [{ user }] = useAuthStore();
    const [, { selectOption }] = useBoat();

    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        const idx = updatedWidgetData.findIndex((w) => w.id === id);

        if (idx !== -1) {
            updatedWidgetData[idx][e.target.name as 'startDate' | 'endDate'] = e.target.value;
        }

        setWidgetData([...updatedWidgetData]);
    };

    const formatDate = (inputDate: string) => {
        return new Date(inputDate).toLocaleDateString('en-us', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        let hasError = false;

        setFormError(false);

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);

            if (!updatedWidgetData[foundPollIdx].startDate) {
                setFormError(true);
                hasError = true;
                return false;
            }

            if (foundPollIdx !== -1) {
                updatedWidgetData[foundPollIdx].isEditing = false;
                const startDate = formatDate(d.startDate);
                const endDate = d.endDate ? formatDate(d.endDate) : null;

                updatedWidgetData[foundPollIdx].text = `${startDate}${endDate ? ` - ${endDate}` : ''}`;
            }
        });

        if (hasError) return;

        setWidgetData([...updatedWidgetData]);
    };

    const onRemoveOption: any = (updatedWidgetdata: DateWidgetData[]) => {
        setWidgetData([...updatedWidgetdata]);
    };

    const getInputComponent: any = (optionId: string, data: DateWidgetData) => {
        return (
            <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}>
                <Input
                    label="Start Date"
                    type="date"
                    name="startDate"
                    required
                    onChange={onDataChange(optionId)}
                    value={data.startDate}
                    error={formError}
                    errorLabel="Start date is required"
                />
                <Input
                    label="End Date"
                    type="date"
                    name="endDate"
                    onChange={onDataChange(optionId)}
                    value={data.endDate}
                />
            </Flex>
        );
    };

    return (
        <BoatWidget
            id={id}
            name={name}
            settings={<DateWidgetSettings />}
            onSave={onSave}
            mode={mode}
            data={widgetData || []}
        >
            <Poll
                loading={loading}
                mode={mode}
                data={widgetData}
                selectOption={selectOption}
                getInputComponent={getInputComponent}
                onAddClick={() => {
                    const newData: DateWidgetData = {
                        id: (optionsCounter + 1).toString(),
                        author: { id: user?.id!, name: user!.name, email: user!.email },
                        text: '',
                        selected: false,
                        votes: 0,
                        isEditing: true,
                        startDate: '',
                        endDate: '',
                    };
                    setWidgetData([...widgetData, newData]);
                    setOptionsCounter(optionsCounter + 1);
                }}
                onOptionEdit={(optionId: string) => {
                    const newOptions = [...widgetData];
                    const optionIdx = newOptions.findIndex((p) => p.id === optionId);

                    if (optionIdx !== -1) {
                        newOptions[optionIdx].isEditing = true;
                    }
                    setWidgetData([...newOptions]);
                }}
                onRemoveOption={onRemoveOption}
            />
        </BoatWidget>
    );
};
