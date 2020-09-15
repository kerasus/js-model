import Vue from 'vue'
import Vuex from "vuex"
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios);

class CRUD {

    constructor() {
        this.headers = {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': window.Laravel.csrfToken,
            // 'Content-Type': 'multipart/form-data'
        };
    }

    create(url, data) {
        return axios.post(url, data, {
            headers: this.headers
        })
    }

    read(url, data) {
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
