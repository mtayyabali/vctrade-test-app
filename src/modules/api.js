import axios from 'axios';

export const api = {
    post(url, body) {
        return axios.post(url, body);
    },
    get(url, params) {
        const axiosConfig = {...params};
        return axios.get(url, axiosConfig);
    },
    delete(url, params) {
        const axiosConfig = {...params};
        return axios.delete(url, axiosConfig);
    },
    patch(url, body) {
        return axios.patch(url, body);
    },
};
