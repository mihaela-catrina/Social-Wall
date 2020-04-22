import { authenticationService } from '@/_services';

export function handleResponse(response) {
    return response.json().then(jsonData => {
        console.log(jsonData);
        // returns true if the response returned successfully
        if (!response.ok) {
            if ([400, 401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                location.reload(true);
            }

            const error = response.statusText;
            return Promise.reject(error);
        }

        console.log(jsonData)
        return jsonData;
     });
}