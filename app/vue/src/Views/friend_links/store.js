import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    FriendLinksForm_Loading: false,
    FriendLinksList: [], FriendLinksList_Loading: false
  },
  getters: {
    FriendLinksList: state => state.FriendLinksList
  },
  mutations: {
    GET_FRIEND_LINKS_LIST (state, response) { state.FriendLinksList = response }
  },
  actions: {

    // [Get] 获得友情链接
    GetFriendLinks (cxt) {
      return new Promise((resolve) => {
        cxt.state.FriendLinksList_Loading = true
        axios.get('/api/Manager/Site/GetFriendLinks', {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.FriendLinksList_Loading = false
          cxt.commit('GET_FRIEND_LINKS_LIST', rs.data)
          resolve(rs)
        })
      })
    },

    // [Post] 创建一条友情链接
    CreateFriendLink (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleForm_Loading = true
        axios.post('/api/Manager/Site/CreateFriendLink', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.FriendLinksList_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 更新友情链接
    UpdateFriendLink (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleForm_Loading = true
        axios.post('/api/Manager/Site/UpdateFriendLink', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.FriendLinksList_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 删除友情链接
    DeleteFriendLink (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleForm_Loading = true
        axios.post('/api/Manager/Site/DeleteFriendLink', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.FriendLinksList_Loading = false
          resolve(rs)
        })
      })
    }


  }
}
