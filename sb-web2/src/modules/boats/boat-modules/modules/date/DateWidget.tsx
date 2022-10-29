import { ChangeEvent, FC, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { ModuleData, ModuleExtended } from 'modules/boats/Boat.Types';
import { DateSettings } from 'modules/boats/boat-modules/modules/date/DateSettings';
import { DateModuleDataType, getText } from 'modules/boats/boat-modules/modules/date/Date';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { DatePicker } from 'shared/date-picker/DatePicker';
import { TimePicker } from 'shared/time-picker/TimePicker';

type DataType = ModuleData<DateModuleDataType>;

export const DateWidget: FC<ModuleExtended<DateModuleDataType>> = (props) => {
    const { id, settings, data } = props;
    const [widgetData, setWidgetData] = useState<DataType[]>(data);
    const [startDateError] = useState<string>('');
    const [endDateError] = useState<string>('');
    const [{ user }] = useAuthStore();

    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        const idx = updatedWidgetData.findIndex((w) => w.id === id);

        if (idx !== -1) {
            updatedWidgetData[idx][e.target.name as keyof DateModuleDataType] = e.target.value;
        }

        setWidgetData([...updatedWidgetData]);
    };

    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        let hasError = false;

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);
            const { startDate, endDate, startTime, endTime } = updatedWidgetData[foundPollIdx];

            updatedWidgetData[foundPollIdx].errors = {};

            if (!startDate) {
                hasError = true;
                updatedWidgetData[foundPollIdx].errors!['startDate'] = 'Start date is required';
                return false;
            }

            if (endDate) {
                if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
                    hasError = true;
                    updatedWidgetData[foundPollIdx].errors!['startDate'] = 'End date has to be after start date';

                    return false;
                }
            }

            if (foundPollIdx !== -1) {
                updatedWidgetData[foundPollIdx].isEditing = false;
            }
        });

        setWidgetData([...updatedWidgetData]);

        if (hasError) return false;

        return true;
    };

    const getInputComponent: any = (optionId: string, data: DataType) => {
        return (
            <Box className="date-widget-input-component">
                <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}>
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        placeholder="mm/dd/yyyy"
                        required
                        onChange={onDataChange(optionId)}
                        value={data.startDate}
                        error={!!data.errors!.startDate}
                        errorLabel={data.errors!.startDate}
                    />
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        placeholder="mm/dd/yyyy"
                        onChange={onDataChange(optionId)}
                        error={!!data.errors!.endDate}
                        errorLabel={data.errors!.endDate}
                        value={data.endDate}
                    />
                </Flex>
                <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }} mt="4">
                    <TimePicker
                        label="Start Time"
                        name="startTime"
                        placeholder="hh:mm AM"
                        onChange={onDataChange(optionId)}
                        value={data.startTime}
                    />
                    <TimePicker
                        label="End Time"
                        name="endTime"
                        placeholder="hh:mm AM"
                        onChange={onDataChange(optionId)}
                        value={data.endTime}
                    />
                </Flex>
            </Box>
        );
    };

    return (
        <BoatWidget<DataType>
            {...props}
            data={widgetData}
            settingsNode={<DateSettings id={id} settings={settings} />}
            onOptionSave={onSave}
            getText={getText}
            onAddOption={() => {
                const newData: DataType = {
                    id: `new-option-${new Date().getTime().toString()}`,
                    author: { id: user?.id!, name: user!.name, email: user!.email },
                    selected: false,
                    votes: [],
                    isEditing: true,
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    errors: {},
                };

                setWidgetData([...widgetData, newData]);
            }}
            getInputComponent={getInputComponent}
            onOptionEdit={(data) => {
                setWidgetData(data as DataType[]);
            }}
            onRemoveOption={(options) => {
                setWidgetData(options as DataType[]);
            }}
        ></BoatWidget>
    );
};
