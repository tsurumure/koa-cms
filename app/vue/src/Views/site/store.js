import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    BannerList: [], BannerList_Loading: false,
    TongJi: [], TongJi_Loading: false
  },
  getters: {
    BannerList: state => state.BannerList
  },
  mutations: {
    GET_BANNER_LIST (state, response) { state.BannerList = response },
    GET_TONGJI (state, response) { state.TongJi = response }
  },
  actions: {

    // [Get] 百度统计开放API
    // GetTongji (cxt) {
    //   cxt.state.TongJi_Loading = true
    //   return new Promise((resolve) => {
    //     axios.get('/api/Manager/Tongji/GetTongji').then((rs) => {
    //       resolve(rs)
    //       cxt.state.TongJi_Loading = false
    //       cxt.commit('GET_TONGJI', rs.data)
    //     })
    //   })
    // },

    // [Get] 获得 Banner 轮播图片列表
    GetBannerList (cxt) {
      cxt.state.BannerList_Loading = true
      return new Promise((resolve) => {
        axios.get('/api/Manager/Banner/GetBanner').then((rs) => {
          resolve(rs)
          cxt.state.BannerList_Loading = false
          cxt.commit('GET_BANNER_LIST', rs.data)
        })
      })
    },
    // [Post] 创建 Banner
    CreateBanner (cxt, response) {
      return new Promise((resolve) => {
        cxt.state.BannerList_Loading = true
        axios.post('/api/Manager/Banner/CreateBanner', response, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          resolve(rs)
          cxt.state.BannerList_Loading = false
        })
      })
    },
    // [Post] 排序 Banner
    SortBanner (cxt, response) {
      return new Promise((resolve) => {
        cxt.state.BannerList_Loading = true
        axios.post('/api/Manager/Banner/SortBanner', response, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          resolve(rs)
          cxt.state.BannerList_Loading = false
        })
      })
    },
    // [Post] 删除 Banner
    DeleteBanner (cxt, response) {
      return new Promise((resolve) => {
        cxt.state.BannerList_Loading = true
        axios.post('/api/Manager/Banner/DeleteBanner', response, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          resolve(rs)
          cxt.state.BannerList_Loading = false
        })
      })
    },
    // [Post] 修改 Banner { id: '', title: '', url: '' }
    UpdateBanner (cxt, response) {
      return new Promise((resolve) => {
        cxt.state.BannerList_Loading = true
        axios.post('/api/Manager/Banner/UpdateBanner', response, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          resolve(rs)
          cxt.state.BannerList_Loading = false
        })
      })
    }
  }
}
