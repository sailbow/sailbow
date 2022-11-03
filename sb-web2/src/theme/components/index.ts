import { ButtonStyles } from './Button';
import { InputStyles } from './Input';
import { LinkStyles } from './Link';
import { TextareaStyles } from './Textarea';
import { TabStyles } from './Tabs';
import { SkeletonStyles } from './Skeleton';

export const components = {
    Button: { ...ButtonStyles },
    Link: { ...LinkStyles },
    Input: { ...InputStyles },
    Textarea: { ...TextareaStyles },
    Tabs: { ...TabStyles },
    Skeleton: {
        ...SkeletonStyles
    },
    Text: {
        baseStyle: {
            fontWeight: 'normal',
        },
    },
};
