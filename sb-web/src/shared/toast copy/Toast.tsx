import { createStandaloneToast } from '@chakra-ui/react';

const toast = createStandaloneToast();

enum ToastId {
    Error,
    Success
}

export const showErrorToast = (message: string) => {
    toast.close(ToastId.Error);

    toast({
        id: ToastId.Error,
        title: 'Oops! An error occurred',
        description: message,
        status: 'error',
        position: 'top-right'
    });
};

export const showSuccessToast = (message: string, title?: string) => {
    toast.close(ToastId.Success);

    toast({
        id: ToastId.Success,
        title: title || 'Success!',
        description: message,
        status: 'success',
        position: 'top-right'
    });
};
