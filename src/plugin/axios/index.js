import Vue from 'vue'
import axios from 'axios'
import util from '@/libs/util.js'
axios.interceptors.response.use(res => res.data, err => Promise.reject(err))

//let AUTH_TOKEN=util.cookies.get('token');
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

//Vue.prototype.$axios = axios
