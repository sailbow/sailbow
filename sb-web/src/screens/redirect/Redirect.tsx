import React, { FunctionComponent, useEffect } from 'react';

import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';

import { useToast } from 'contexts/toast/Toast';

export const Redirect: FunctionComponent = () => {
    const history = useHistory();
    const [, dispatch] = useToast();

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        console.log(urlSearchParams);
    });

    return <span>Redirecting...</span>;
};
