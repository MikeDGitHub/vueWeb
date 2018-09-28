import axios from 'axios';
import qs from "qs";
import util from '@/libs/util.js'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';
//http request 拦截器
axios.interceptors.request.use(
    config => {
        const token = util.cookies.get('token');
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        if (token && config.url.indexOf('token') < 0) {
            config.headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        } else {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

let responseData = {}
//http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        debugger;
        if (error.response !== undefined) {
            if (error.response.status === 401) {
                util.cookies.set('token', '');
                responseData = error.response;
                let data = {
                    grant_type: 'refresh_token',
                    refresh_token: util.cookies.get('refresh_token'),
                    client_id: 2,
                    client_secret: 'secret'
                }
                post('http://39.104.164.180:5000/connect/token', data)
                    .then(res => {
                        util.cookies.set('token', res.access_token)
                        util.cookies.set('refresh_token', res.refresh_token)
                        let custom = responseData.request.custom;
                        let options=custom.options;
                        if (custom.method === 'POST') {
                            return post(options.url,JSON.parse(options.body))
                        } else if (custom.method === 'GET') {
                            return fetch(options.url);
                        }
                    })
                    .catch(err => {
                        router.push({
                            path: "/login",
                            querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
                        })
                    })
            }
        } else {
            router.push({
                path: "/login",
                querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
            })
        }
        return Promise.reject(error)
    }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
    })
}

/**
* 封装patch请求
* @param url
* @param data
* @returns {Promise}
*/

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
* 封装put请求
* @param url
* @param data
* @returns {Promise}
*/

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}