import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getById,
    postMessage,
    getAllMessages,
    sendResponse
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}


function postMessage(subject, message, userId) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ userId, subject, message })
    };

    return fetch(`${config.apiUrl}/messages/contact`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {
            return data
        });
}

function getAllMessages() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/messages`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {console.log(data); return data});
}

function sendResponse(response, userId, originalMessage) {
    console.log(originalMessage);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ userId, response, originalMessage })
    };

    return fetch(`${config.apiUrl}/messages/respond`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {
            return data
        });
}