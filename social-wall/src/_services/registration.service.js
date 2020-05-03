import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

export const registrationService = {
    register,
};

function register(role, email, firstName, lastName, username, password) {
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
