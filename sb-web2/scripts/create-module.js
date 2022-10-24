const { argv } = require('process');
const fs = require('fs');

const moduleName = argv[2].toLowerCase();
const capName = moduleName[0].toUpperCase() + moduleName.substring(1);
const path = `src/modules/boats/boat-modules/modules/${moduleName}`;

init();

function init() {
    fs.mkdir(path, { recursive: true }, (err, path) => {
        genTS(path);
        genManifest(path);
        genSettings(path);
        genWidget(path);
        if (err) console.log(err);
    });
}

function genTS(path) {
    const file = `import { ModuleData } from 'modules/boats/Boat.Types';
import { ${capName}Settings } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}Settings';
import { ${capName}Manifest } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}Manifest';
import { ${capName}Widget } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}Widget';
import { SbCalendarIcon, Module${capName}Image } from 'shared/icons/Icons';

export type ${capName}ModuleDataType = {};

export const getText = (data: ModuleData<${capName}ModuleDataType>) => {
    // getText function here
    return '';
};

export const ${capName}Module = {
    Icon: SbCalendarIcon,
    Image: Module${capName}Image,
    Manifest: ${capName}Manifest,
    Widget: ${capName}Widget,
    Settings: ${capName}Settings,
};
`;

    fs.appendFile(`${path}/${capName}.ts`, file, function (err) {
        if (err) throw err;
        console.log(`Generated ${capName}.ts`);
    });
}

function genManifest(path) {
    const file = `import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { Module } from 'modules/boats/Boat.Types';
import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { ${capName}Module, ${capName}ModuleDataType, getText } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}';
import { renderData } from 'modules/boats/boat-modules/modules/Modules';

export const ${capName}Manifest: FC<Module<${capName}ModuleDataType>> = ({ data, loading, finalizedOptionId }) => {
    return (
        <BoatManifest icon={<${capName}Module.Icon />} label="${capName}" loading={loading} finalized={finalizedOptionId}>
            <Text>{renderData(data, getText, finalizedOptionId)}</Text>
        </BoatManifest>
    );
};    
    `;

    fs.appendFile(`${path}/${capName}Manifest.tsx`, file, function (err) {
        if (err) throw err;
        console.log(`Generated ${capName}Manifest.tsx`);
    });
}

function genSettings(path) {
    const file = `import { FC } from 'react';

import { BoatSettings } from 'modules/boats/common/boat-settings/BoatSettings';
import { ModuleSettings } from 'modules/boats/Boat.Types';
    
interface Props {
    id: string;
    settings: ModuleSettings;
}
    
export const ${capName}Settings: FC<Props> = ({ id, settings }) => {
    return <BoatSettings id={id} settings={settings} />;
};
`;

    fs.appendFile(`${path}/${capName}Settings.tsx`, file, function (err) {
        if (err) throw err;
        console.log(`Generated ${capName}Settings.tsx`);
    });
}

function genWidget(path) {
    const file = `import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';
    
import { useAuthStore } from 'modules/auth/Auth.Store';
import { Module, ModuleData } from 'modules/boats/Boat.Types';
import { ${capName}Settings } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}Settings';
import { ${capName}ModuleDataType, getText } from 'modules/boats/boat-modules/modules/${moduleName}/${capName}';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
    
type DataType = ModuleData<${capName}ModuleDataType>;
    
export const ${capName}Widget: FC<Module<${capName}ModuleDataType>> = (props) => {
    const { id, settings, data } = props;
    const [widgetData, setWidgetData] = useState<DataType[]>(data);
    const [{ user }] = useAuthStore();
    
    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        // update here
        setWidgetData([...updatedWidgetData]);
    };
    
    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        let hasError = false;

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);
            // validate here

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
                    
            </Flex>
        );
    };
    
    return (
        <BoatWidget<DataType>
            {...props}
            data={widgetData}
            settingsNode={<${capName}Settings id={id} settings={settings} />}
            onSave={onSave}
            onAddOption={() => {
                const newData: DataType = {
                    id: new Date().getTime().toString(),
                    author: { id: user?.id!, name: user!.name, email: user!.email },
                    text: '',
                    selected: false,
                    votes: 0,
                    isEditing: true,
                };
    
                setWidgetData([...widgetData, newData]);
            }}
            getInputComponent={getInputComponent}
                onOptionEdit={(data) => {
                setWidgetData(data as DataType[]);
            }}
            onRemoveOption={onRemoveOption}
        ></BoatWidget>
    );
};`;

    fs.appendFile(`${path}/${capName}Widget.tsx`, file, function (err) {
        if (err) throw err;
        console.log(`Generated ${capName}Widget.tsx`);
    });
}
