import { TourType } from 'modules/tour/Tour';

export const Steps: TourType[] = [
    {
        element: '.sb-banner',
        title: 'Set a mood',
        intro: 'Start by setting the mood for your boat. Select from our favorite colors or add an image using the "Change Banner" button!',
        position: 'right',
    },
    {
        element: '.create-boat-name',
        title: 'Give your boat a name',
        intro: 'Its required to name your boat in order for you and your crew to correctly identify it.',
        position: 'right',
    },
    {
        element: '.create-boat-description',
        title: 'Describe your boat',
        intro: 'This is optional, but you can have a small write up to add a few more details as to what your boat is about!',
        position: 'right',
    },
    {
        element: '.create-boat-gather-crew',
        title: 'Add or invite people',
        intro: 'Start typing the names of the people yo uwant to add. If they do not show up, type a valid email address and an invitation will be sent to them!',
        position: 'top',
    },
    {
        element: '.create-boat-actions',
        title: 'Save or Cancel',
        intro: 'Once you Start, invitations will be sent. You can cancel it incase you change your mind!',
        position: 'top',
    },
];
