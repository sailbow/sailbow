import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { Module, ModuleData } from 'modules/boats/Boat.Types';
import { DateWidgetSettings } from 'modules/boats/boat-modules/modules/date/DateWidgetSettings';
import { DateModuleDataType, getText } from 'modules/boats/boat-modules/modules/date/_DateModule';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { Input } from 'shared/input/Input';

type DataType = ModuleData<DateModuleDataType>;

export const DateWidget: FC<Module<DateModuleDataType>> = (props) => {
    const { id, settings, data } = props;
    const [widgetData, setWidgetData] = useState<DataType[]>(data);
    const [optionsCounter, setOptionsCounter] = useState<number>(0);
    const [formError, setFormError] = useState<boolean>();
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
        <BoatWidget<DataType>
            {...props}
            data={widgetData}
            settingsNode={<DateWidgetSettings id={id} settings={settings} />}
            onSave={onSave}
            onAddOption={() => {
                const newData: DataType = {
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
