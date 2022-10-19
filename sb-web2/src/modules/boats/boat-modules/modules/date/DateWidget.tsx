import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { Module, ModuleData } from 'modules/boats/Boat.Types';
import { DateWidgetSettings } from 'modules/boats/boat-modules/modules/date/DateWidgetSettings';
import { DateModuleDataType, getText } from 'modules/boats/boat-modules/modules/date/_DateModule';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { DatePicker } from 'shared/date-picker/DatePicker';

type DataType = ModuleData<DateModuleDataType>;

export const DateWidget: FC<Module<DateModuleDataType>> = (props) => {
    const { id, settings, data } = props;
    const [widgetData, setWidgetData] = useState<DataType[]>(data);
    const [startDateError, setStartDateError] = useState<string>('');
    const [endDateError, setEndDateError] = useState<string>('');
    const [{ user }] = useAuthStore();

    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        const idx = updatedWidgetData.findIndex((w) => w.id === id);

        if (idx !== -1) {
            updatedWidgetData[idx][e.target.name as 'startDate' | 'endDate'] = e.target.value;
        }

        setWidgetData([...updatedWidgetData]);
    };

    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        let hasError = false;

        setStartDateError('');
        setEndDateError('');

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);
            const { startDate, endDate } = updatedWidgetData[foundPollIdx];

            if (!startDate) {
                setStartDateError('Start date is required');
                hasError = true;
                return false;
            }

            if (endDate) {
                if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
                    hasError = true;
                    setEndDateError('End date has to be after start date');
                    return false;
                }
            }

            if (foundPollIdx !== -1) {
                updatedWidgetData[foundPollIdx].isEditing = false;
                updatedWidgetData[foundPollIdx].text = getText(d);
            }
        });

        if (hasError) return false;

        setWidgetData([...updatedWidgetData]);

        return true;
    };

    const onRemoveOption: any = (updatedWidgetdata: DataType[]) => {
        setWidgetData([...updatedWidgetdata]);
    };

    const getInputComponent: any = (optionId: string, data: DataType) => {
        return (
            <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}>
                <DatePicker
                    label="Start Date"
                    name="startDate"
                    placeholder="mm/dd/yyyy"
                    required
                    onChange={onDataChange(optionId)}
                    value={data.startDate}
                    error={!!startDateError}
                    errorLabel={startDateError}
                />
                <DatePicker
                    label="End Date"
                    name="endDate"
                    placeholder="mm/dd/yyyy"
                    onChange={onDataChange(optionId)}
                    error={!!endDateError}
                    errorLabel={endDateError}
                    value={data.endDate}
                />
            </Flex>
        );
    };

    return (
        <BoatWidget<DataType>
            {...props}
            data={widgetData}
            settingsNode={<DateWidgetSettings id={id} settings={settings} />}
            onSave={onSave}
            onAddOption={() => {
                const newData: DataType = {
                    id: new Date().getTime().toString(),
                    author: { id: user?.id!, name: user!.name, email: user!.email },
                    text: '',
                    selected: false,
                    votes: 0,
                    isEditing: true,
                    startDate: '',
                    endDate: '',
                };
                setWidgetData([...widgetData, newData]);
            }}
            getInputComponent={getInputComponent}
            onOptionEdit={(optionId: string) => {
                const newOptions = [...widgetData];
                const optionIdx = newOptions.findIndex((p) => p.id === optionId);

                if (optionIdx !== -1) {
                    newOptions[optionIdx].isEditing = true;
                }
                setWidgetData([...newOptions]);
            }}
            onRemoveOption={onRemoveOption}
        ></BoatWidget>
    );
};
