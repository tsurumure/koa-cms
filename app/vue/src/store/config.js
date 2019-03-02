import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  state: {
    CookieValidTime: 2,
    Auth: { 'Authorization': 'Bearer ' + Cookie.get('token') }
  },
  getters: {
    Auth: state => state.Auth
  },
  mutations: {
    SET_TOKEN_HEADER (state, response) {
      state.Auth = { 'Authorization': 'Bearer ' + response }
    }
  }
}
