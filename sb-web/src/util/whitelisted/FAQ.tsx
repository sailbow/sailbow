import React, { FunctionComponent } from 'react';

import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';

import { Base } from 'util/whitelisted/Base';
import { FAQData } from 'util/whitelisted/Data';
import { SbMinusIcon, SbPlusIcon } from 'util/icons/Icons';

export const FAQ: FunctionComponent = () => {
    return (
        <Base title="Frequently Asked Questions" docTitle="FAQ">
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
                                        {isExpanded ? <SbMinusIcon fontSize="xl" /> : <SbPlusIcon fontSize="xl" />}
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
