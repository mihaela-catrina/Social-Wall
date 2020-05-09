import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const registrationService = {
    register,
    registerSupport
};

function register(role, email, firstName, lastName, username, password) {
    console.log(role);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ role, email, firstName, lastName, username, password })
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {
            return data
        });
}


function registerSupport(role, username, password) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ role, username, password })
    };

    console.log(requestOptions);

    return fetch(`${config.apiUrl}/users/register/support`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {
            return data
        });
}