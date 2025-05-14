import axios from 'axios';

// TODO: Update the base url of the server
const BASE_URL = '';

// Fetches data from server
export const getData = async service => {
    try {
        return (
            await axios.get(BASE_URL + service, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
        throw error.response?.data;
    }
};

// Posts data to server
export const postData = async (service, body) => {
    try {
        return (
            await axios.post(BASE_URL + service, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
        throw error.response?.data;
    }
};

// Puts data on server
export const putData = async (service, body) => {
    try {
        return (
            await axios.put(BASE_URL + service, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
        throw error.response?.data;
    }
};

// Puts data on server
export const patchData = async (service, body) => {
    try {
        return (
            await axios.patch(BASE_URL + service, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
        throw error.response?.data;
    }
};

// Deletes data from server
export const deleteData = async service => {
    try {
        return (
            await axios.delete(BASE_URL + service, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
        throw error.response?.data;
    }
};
