import { FunctionComponent, useEffect, useState } from 'react';

import { IconButton } from '@chakra-ui/react';
import { Step, Steps } from 'intro.js-react';

import { SbQuestionIcon } from 'shared/icons/Icons';

import './Tour.scss';

export interface TourType extends Step {
    title: string;
}

interface Props {
    initialStep?: number;
    steps: Step[];
}

export const Tour: FunctionComponent<Props> = ({ steps, initialStep = 0 }) => {
    const [computedSteps, setComputedSteps] = useState<Step[]>([]);
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        const newSteps = steps.map((step: Step) => ({ ...step, tooltipClass: 'sb-tour' }));

        setComputedSteps(newSteps);
    }, [steps]);

    return (
        <>
            <IconButton
                aria-label="help-icon"
                variant="ghost"
                colorScheme="gray"
                color="brand.muted"
                fontSize="xl"
                icon={<SbQuestionIcon />}
                onClick={() => setEnabled(true)}
            />
            <Steps
                options={{ nextLabel: 'Next', prevLabel: 'Prev' }}
                enabled={enabled}
                steps={computedSteps}
                initialStep={initialStep}
                onExit={() => setEnabled(false)}
            />
        </>
    );
};

Tour.defaultProps = {
    initialStep: 0,
};
