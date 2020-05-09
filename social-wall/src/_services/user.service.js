import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getById,
    postMessage,
    getAllMessages,
    sendResponse,
    deleteMessage,
    setImportantMessage,
    getImportantMessages,
    postIdea,
    getAllIdeas,
    levelUpIdea,
    levelDownIdea,
    levelUpHeartsIdea,
    viewPendingRequests,
    approveRequest
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
        .then(data => {return data});
}

function getImportantMessages() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/messages/important`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
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

function deleteMessage(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/messages/${id}`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {console.log(data); return data});
}

function setImportantMessage(id) {
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/messages/${id}/important`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {console.log(data); return data});
}

function postIdea(subject, description, authority, tags, userId) {
    let tagsArr = []
    tags.map((tag, i) => {
        tagsArr.push(tag.label);
    });
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ subject: subject, description: description, authority: authority.value, tags: tagsArr, userId: userId})
    };

    return fetch(`${config.apiUrl}/ideas/`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {
            return data
        });
}

function getAllIdeas() {
    const requestOptions = { method: 'GET',headers: { 'Content-Type': 'text/plain' } };
    return fetch(`${config.apiUrl}/ideas`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}

function levelUpIdea(id) {
    const requestOptions = { method: 'PUT' };
    return fetch(`${config.apiUrl}/ideas/${id}/levelup`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}

function levelDownIdea(id) {
    const requestOptions = { method: 'PUT' };
    return fetch(`${config.apiUrl}/ideas/${id}/leveldown`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}

function levelUpHeartsIdea(id) {
    const requestOptions = { method: 'PUT' };
    return fetch(`${config.apiUrl}/ideas/${id}/heart`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}

function viewPendingRequests() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/pending`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}

function approveRequest(id) {
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/pending/${id}`, requestOptions)
        .then(res => handleResponse(res))
        .then(data => {return data});
}