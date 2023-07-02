import Vue from 'vue'
import App from './App'

import uniapi from './common/js/uniapi.js'

Vue.prototype.$uniapi = uniapi

// 封装的请求函数
import { request } from "./common/js/axios.js"
Vue.prototype.$axios = request

import common from './common/js/common.js'
Vue.prototype.$common = common

import login from './common/js/login.js'
Vue.prototype.$login = login

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
