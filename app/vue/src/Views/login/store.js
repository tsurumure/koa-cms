import Cookie from 'vue-cookie'
import axios from 'axios'
import { MessageBox } from 'element-ui'

export default {
  namespaced: true,
  state: {
    isLoading: false, isLoaded: false,
    CaptchaImg: '',
    CookieUsers: Cookie.get('LoginUsers') ? Cookie.get('LoginUsers').split(',').map((item) => ({ value: item })) : []
  },
  mutations: {
    GET_CAPTCHA (state, response) {
      state.CaptchaImg = response
    },
    CLEAR_COOKIE_USERS (state) {
      MessageBox.confirm('清除历史记录吗?').then(() => {
        Cookie.delete('LoginUsers')
        state.CookieUsers = []
      }).catch(_ => {})
    }
  },
  actions: {
    GetCaptcha (cxt, params) {
      axios.get('/api/Manager/User/GetLoginCaptcha').then((rs) => {
        cxt.commit('GET_CAPTCHA', rs.data)
      })
    },
    PostLogin (cxt, params) {
      return new Promise((resolve) => {
        cxt.state.isLoading = true
        axios.post('/api/Manager/User/Login', params).then((rs) => {
          cxt.state.isLoading = false
          resolve(rs)
        })
      })
    }
  }
}
