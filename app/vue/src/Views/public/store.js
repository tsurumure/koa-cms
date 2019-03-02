import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    UserInfo_Loading: false,
    UserInfo: { nickname: 'Loading..', level_name: '-' },
    UploadImg_Loading: false
  },
  getters: {
    UserInfo: state => state.UserInfo,
    UserInfoSimple: state => `${state.UserInfo.nickname} (${state.UserInfo.level_name})`
  },
  mutations: {
    GET_USER_INFO (state, response) {
      state.UserInfo = response.datas
      if (response.CookieValidTime) {
        Cookie.set('UserInfo', JSON.stringify(state.UserInfo), { expires: response.CookieValidTime + 'h' })
      } else {
        Cookie.set('UserInfo', JSON.stringify(state.UserInfo))
      }
    }
  },
  actions: {
    // [Get] 获得(自己)的用户信息
    GetUserInfo (cxt) { // { state, dispatch, rootState }
      if (!Cookie.get('UserInfo')) {
        axios.get('/api/Manager/User/GetUserInfo', { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.commit('GET_USER_INFO', { datas: rs.data, 'CookieValidTime': cxt.rootState.config.CookieValidTime })
        })
      } else {
        cxt.commit('GET_USER_INFO', { datas: JSON.parse(Cookie.get('UserInfo')) })
      }
    },

    // UploadImgByBase64
    UploadImgByBase64 (cxt, { base64 }) {
      cxt.state.UploadImg_Loading = true
      return new Promise((resolve) => {
        axios.post('/api/Manager/Common/UploadImgByBase64', { base64 }, { headers: cxt.rootState.config.Auth }).then((rs) => {
          cxt.state.UploadImg_Loading = false
          resolve(rs)
        })
      })
    },

    // [Post] 退出登录
    PostLogout (cxt, token) {
      return new Promise((resolve) => {
        axios.post('/api/Manager/User/Logout', { 'token': token }).then(() => {
          resolve()
        })
      })
    }
  }
}
