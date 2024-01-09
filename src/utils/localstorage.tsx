'use strict';

// Set data to local storage by key with value
const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

// get data from local stoage by key
const getLocalStorage = (key: string) => {
    if (key === 'userDetails') {
        return JSON.parse(localStorage.getItem('userDetails') || 'null');
    }
    return localStorage.getItem(key);
};

export {
    setLocalStorage,
    getLocalStorage
};
