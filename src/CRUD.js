import axios from 'axios'

class CRUD {

    constructor(headers) {
        this.setHeaders(headers);
    }

    setHeaders(headers) {
        if (typeof headers === 'undefined') {
            headers = {};
        }
        // {
        //     'Accept': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        // }
        this.headers = headers;
    }

    create(url, data) {
        return axios.post(url, data, {
            headers: this.headers
        })
    }

    fetch(url, data) {
        return axios.get(url, {
            headers: this.headers,
            params: data
        })
    }

    update(url, data) {
        return axios.put(url, data, {
            headers: this.headers
        })
    }

    delete(url) {
        return axios.delete(url, {
            headers: this.headers
        });
    }
}
export default CRUD;
