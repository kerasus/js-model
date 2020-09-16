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

    checkUrl(url) {
        if (typeof url !== 'string') {
            console.error('url not set')
            return false;
        }
        return true;
    }

    create(url, data) {

        if (!this.checkUrl(url)) {
            return new Promise();
        }
        return axios.post(url, data, {
            headers: this.headers
        })
    }

    fetch(url, data) {

        if (!this.checkUrl(url)) {
            return new Promise();
        }
        return axios.get(url, {
            headers: this.headers,
            params: data
        })
    }

    update(url, data) {

        if (!this.checkUrl(url)) {
            return new Promise();
        }
        return axios.put(url, data, {
            headers: this.headers
        })
    }

    delete(url) {

        if (!this.checkUrl(url)) {
            return new Promise();
        }
        return axios.delete(url, {
            headers: this.headers
        });
    }
}
export default CRUD;
