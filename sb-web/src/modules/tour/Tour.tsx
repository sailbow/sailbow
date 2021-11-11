import React, { FunctionComponent, useEffect, useState } from 'react';

import { Step, Steps } from 'intro.js-react';

import 'modules/tour/Tour.scss';

interface Props {
    enabled: boolean;
    initialStep?: number;
    onExit: () => void;
    steps: Step[];
}

export const Tour: FunctionComponent<Props> = ({ steps, initialStep = 0, onExit, enabled }) => {
    const [computedSteps, setComputedSteps] = useState<Step[]>([]);

    useEffect(() => {
        const newSteps = steps.map((step: Step) => ({ ...step, tooltipClass: 'sb-tour' }));

        setComputedSteps(newSteps);
    }, [steps]);

    return (
        <Steps
            options={{ nextLabel: 'Next', prevLabel: 'Prev' }}
            enabled={enabled}
            steps={computedSteps}
            initialStep={initialStep}
            onExit={onExit}
        />
    );
};

Tour.defaultProps = {
    initialStep: 0,
};
