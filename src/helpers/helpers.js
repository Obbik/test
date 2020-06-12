import axios from 'axios'

export const api = (url, method, headers, data, cb) => {
    return axios({
        method,
        url,
        headers,
        data
    })
    .then(res => {
        cb(res);
    })
    .catch(err => {
        cb(err.response);
    });
}