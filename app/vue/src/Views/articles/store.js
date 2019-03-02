import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    PageOffset: 0, CateId: 0, Keyword: '', ArticleForm_Loading: false,
    ArticleList: [], ArticleList_Loading: false,
    ArticleCateTree: [], ArticleCateTree_Loading: false,
    ArticleDetail: [], ArticleDetail_Loading: false
  },
  getters: {
    ArticleList: state => state.ArticleList,
    ArticleCateTree: state => state.ArticleCateTree,
    ArticleDetail: state => state.ArticleDetail
  },
  mutations: {
    GET_ARTICLE_LIST (state, response) {
      state.ArticleList = response
    },
    GET_ARTICLE_CATE_TREE (state, response) {
      state.ArticleCateTree = response
      // state.ArticleCateTree = response.map((item) => {
      //   item['hover'] = false
      //   return item
      // })
    },
    GET_ARTICLE_Detail (state, response) {
      state.ArticleDetail = response
    }
  },
  actions: {

    // ---------------------------------- 列表 ------------------------------------------

    // [Get] 获得文章列表
    GetArticlesList (cxt, { PageLimit, PageOffset, CateId, Keyword } = { PageLimit: cxt.rootState.PageLimit, PageOffset: cxt.state.PageOffset}) {
      const limit = PageLimit || cxt.rootState.PageLimit
      const offset = PageOffset || cxt.state.PageOffset
      const cateid = CateId ? '&cate_id=' + CateId : ''
      const keyword = Keyword ? '&keyword=' + Keyword : ''
      cxt.state.ArticleList_Loading = true

      axios.get('/api/Manager/Article/GetArticleList?limit=' + limit + '&offset=' + offset + cateid + keyword, {
        headers: cxt.rootState.config.Auth
      }).then((rs) => {
        cxt.state.ArticleList_Loading = false
        cxt.commit('GET_ARTICLE_LIST', rs.data)
      })
    },
    // [Post] 创建文章
    CreateArticle (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleForm_Loading = true
        axios.post('/api/Manager/Article/CreateArticle', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleForm_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 更新文章
    UpdateArticle (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleForm_Loading = true
        axios.post('/api/Manager/Article/UpdateArticle', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleForm_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 删除文章 (批量)
    DeleteArticle_Batch (cxt, datas) {
      return new Promise((resolve) => {
        cxt.state.ArticleList_Loading = true
        axios.post('/api/Manager/Article/DeleteArticleBatch', datas, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleList_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 删除文章 (单条)
    DeleteArticle_Simple (cxt, {aid, cate_id}) {
      return new Promise((resolve) => {
        cxt.state.ArticleList_Loading = true
        axios.post('/api/Manager/Article/DeleteArticle', { aid, cate_id }, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleList_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 设置文章状态
    ChangeIsActive (cxt, { id, is_active }) {
      return new Promise((resolve) => {
        cxt.state.ArticleList_Loading = true
        axios.post('/api/Manager/Article/ChangeIsActive', { id, is_active }, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          cxt.state.ArticleList_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 设置文章是否置顶
    ChangeIsTop (cxt, { id, is_top }) {
      return new Promise((resolve) => {
        cxt.state.ArticleList_Loading = true
        axios.post('/api/Manager/Article/ChangeIsTop', { id, is_top }, {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          cxt.state.ArticleList_Loading = false
          resolve(rs)
        })
      })
    },

    // ---------------------------------- 分类 ------------------------------------------
    // [Get] 获得文章分类
    GetArticlesCatesList (cxt) {
      return new Promise((resolve) => {
        cxt.state.ArticleCateTree_Loading = true
        axios.get('/api/Manager/Article/Cate/GetArticleCate', {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          resolve(rs)
          cxt.state.ArticleCateTree_Loading = false
          cxt.commit('GET_ARTICLE_CATE_TREE', rs.data)
        })
      })
    },
    // [Post] 添加分类
    CreateArticleCate (cxt, { label, sort, pid } = { sort: 0 }) {
      return new Promise((resolve) => {
        cxt.state.ArticleCateTree_Loading = true
        axios.post('/api/Manager/Article/Cate/CreateArticleCate', { label, sort, pid }, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleCateTree_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 修改分类
    UpdateArticleCate (cxt, { id, label }) {
      return new Promise((resolve) => {
        cxt.state.ArticleCateTree_Loading = true
        axios.post('/api/Manager/Article/Cate/UpdateArticleCate', { id, label }, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleCateTree_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 修改分类 排序
    UpdateArticleCateSort (cxt, { type, id, target_id }) {
      return new Promise((resolve) => {
        cxt.state.ArticleCateTree_Loading = true
        axios.post('/api/Manager/Article/Cate/UpdateArticleCateSort', { type, id, target_id }, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleCateTree_Loading = false
          resolve(rs)
        })
      })
    },
    // [Post] 删除分类
    DeleteArticleCate (cxt, id) {
      return new Promise((resolve) => {
        cxt.state.ArticleCateTree_Loading = true
        axios.post('/api/Manager/Article/Cate/DeleteArticleCate', { id }, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          cxt.state.ArticleCateTree_Loading = false
          resolve(rs)
        })
      })
    },

    // ---------------------------------- 详情 ------------------------------------------
    // [Get] 获得文章详情
    GetArticleDetail (cxt, id) {
      return new Promise((resolve) => {
        cxt.state.ArticleDetail_Loading = true
        axios.get('/api/Manager/Article/GetArticleDetail?aid=' + id, {
          headers: cxt.rootState.config.Auth
        }).then((rs) => {
          resolve(rs)
          cxt.state.ArticleDetail_Loading = false
          cxt.commit('GET_ARTICLE_Detail', rs.data)
        })
      })
    }



    // GetArticleDetail

  }
}
