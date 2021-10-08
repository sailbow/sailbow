import React, { FunctionComponent } from 'react';

import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';

import { Base } from 'screens/whitelisted/Base';
import { FAQData } from 'screens/whitelisted/Data';
import { Minus, Plus } from 'util/Icons';

export const FAQ: FunctionComponent = () => {
    return (
        <Base title="Frequently Asked Questions">
            {FAQData.map((data) => (
                <Accordion allowMultiple key={data.question}>
                    <AccordionItem>
                        {({ isExpanded }) => (
                            <>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="lg">
                                            {data.question}
                                        </Box>
                                        {isExpanded ? <Minus fontSize="xl" /> : <Plus fontSize="xl" />}
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontWeight="normal">
                                    {data.answer}
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>
                </Accordion>
            ))}
        </Base>
    );
};
