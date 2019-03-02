import Cookie from 'vue-cookie'
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  namespaced: true,
  state: {
    // UserInfo_My_Form: {},
    UsersList: [], UserInfo_Loading: false, UsersList_Loading: false, Password_Loading: false
  },
  getters: {
    // UserInfo_My_Form: (state, getters, rootState) => {
    //   return JSON.parse(JSON.stringify(rootState.Common.UserInfo))
    // },
    UsersList: state => state.UsersList
  },
  mutations: {
    GET_USERS_LIST (state, response) {
      state.UsersList = response
    }
  },
  actions: {
    // [Get] 获得用户信息列表
    GetUsersList (cxt) {
      cxt.state.UsersList_Loading = true
      return new Promise((resolve) => {
        cxt.dispatch('Public/GetUserInfo', {}, {root: true}).then(() => {
          axios.get('/api/Manager/User/GetUser', { headers: cxt.rootState.config.Auth }).then((rs) => {
            cxt.state.UsersList_Loading = false
            cxt.commit('GET_USERS_LIST', rs.data.list)
            resolve(rs)
          })
        })
      })
    },
    // [Post] 更新[我的]用户信息
    UpdateUserInfo (cxt, datas) {
      cxt.state.UserInfo_Loading = true
      return new Promise((resolve) => {
        axios.post('/api/Manager/User/UpdateUserInfo', datas, { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.state.UserInfo_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 修改我的密码
    UpdateMyPassword (cxt, datas) {
      cxt.state.Password_Loading = true
      return new Promise((resolve) => {
        axios.post('/api/Manager/User/UpdateMyPassword', datas, { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.state.Password_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 修改我的密码
    ResetPassword (cxt, datas) {
      cxt.state.Password_Loading = true
      return new Promise((resolve) => {
        axios.post('/api/Manager/User/ResetPassword', datas, { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.state.Password_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 删除用户
    RemoveUser (cxt, datas) {
      cxt.state.Password_Loading = true
      return new Promise((resolve) => {
        axios.post('/api/Manager/User/RemoveUser', datas, { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.state.Password_Loading = false
          resolve(rs)
        })
      })
    }

  }
}
