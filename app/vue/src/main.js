/* eslint-disable */
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

import Vue from 'vue'
const isDev = process.env.NODE_ENV == 'development'
Vue.config.devtools = isDev
Vue.config.productionTip = isDev
Vue.prototype.$Vue = Vue

import Vuex from 'vuex'
Vue.use(Vuex)

import Cookie from 'vue-cookie'
import NProgress from 'nprogress'
// import AsyncComputed from 'vue-async-computed'
// Vue.use(AsyncComputed)

import './utils/flexibility'
import utils from './utils'
Vue.use(utils)

import valid from './utils/valid'
Vue.use(valid)

import './utils/directive'

// Lodash (70KB+)
// https://www.lodashjs.com/docs/4.17.5.html
import _ from 'lodash'

// Element-UI
// http://element.eleme.io/#/zh-CN/component/quickstart
import 'element-ui/lib/theme-chalk/index.css'
import {
  Container, Main, Header, Footer, Aside, Table, TableColumn, Row,
  Message, MessageBox, Notification, Loading, Button, Checkbox, Radio, Menu, Submenu, MenuItem, MenuItemGroup,
  Col, Form, FormItem, Pagination, Tabs, TabPane, Input, Dialog, Card, Breadcrumb, BreadcrumbItem, Badge,
  Upload, Switch, Select, DatePicker, Popover, Option, Alert, Tag
} from 'element-ui'
[
  Container, Main, Header, Footer, Aside, Table, TableColumn, Row,
  Loading, Button, Checkbox, Radio, Menu, Submenu, MenuItem, MenuItemGroup,
  Col, Form, FormItem, Pagination, Tabs, TabPane, Input, Dialog, Card, Breadcrumb, BreadcrumbItem, Badge,
  Upload, Switch, Select, DatePicker, Popover, Option, Alert, Tag
].forEach((item) => {
  Vue.use(item)
})
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
// Vue.prototype.$loading = Loading.service;

// End Element-UI

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.prototype.SConfig = SConfig
Vue.use(VueAxios, axios)
axios.defaults.baseURL = SConfig.api
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// Axios 请求拦截器
axios.interceptors.request.use((config) => {
  NProgress.start()
  return config
}, (error) => {
  return Promise.reject(error)
})
// Axios 响应拦截器
axios.interceptors.response.use((response) => {
  NProgress.done()
  return response
}, (err) => {
  console.log(err)
  // let al = MessageBox.alert(
  //   err.response.data.error || err.response.data, err.response.status,
  //   {
  //     callback: () => {
  //       Cookie.delete('token')
  //       Cookie.delete('UserInfo')
  //       router.push('login')
  //     }
  //   }
  // )
  return Promise.reject(err)
})

import router from './router.js'
router.beforeEach ((to, from, next) => {
  if (!Cookie.get('token')) {
    if (to.path != '/login') {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})


import App from './App'
import store from './store'
new Vue({
  el: '#app',
  router, store,
  render: h => h(App)
})
/* eslint-disable */
