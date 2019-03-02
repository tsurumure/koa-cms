import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

import IndexComp from '@/Views/index'
import ParentComp from '@/Views/public/parent'

Vue.use(Router)

Vue.prototype.router = {
  routes: [
    {
      path: '/login', name: 'login',
      component: () => import(/* webpackChunkName: "Login" */'@/Views/login/index')
    },
    {
      path: '/', component: IndexComp,
      children: [
        {
          path: '/', meta: { title: '管理首页' },
          component: () => import(/* webpackChunkName: "Home" */'@/Views/home/index')
        },
        {
          path: '/site', component: ParentComp, meta: { title: '账号管理', keepAlive: true },
          children: [
            {
              path: 'info', meta: { title: '网站信息', keepAlive: true },
              component: () => import(/* webpackChunkName: "Site.info" */'@/Views/site/info')
            },
            {
              path: 'banner', meta: { title: '轮播图片' },
              component: () => import(/* webpackChunkName: "Site.banner" */'@/Views/site/banner')
            }
          ]
        },
        {
          path: '/friend_links', meta: { title: '友情链接', keepAlive: true },
          component: () => import(/* webpackChunkName: "FriendLinks" */'@/Views/friend_links/list')
        },
        {
          path: '/account', component: ParentComp, meta: { title: '账号管理', keepAlive: true },
          children: [
            {
              path: 'my', meta: { title: '我的账号', keepAlive: true },
              component: () => import(/* webpackChunkName: "Account.my" */'@/Views/account/my')
            },
            {
              path: 'list', meta: { title: '全部账号', keepAlive: true },
              component: () => import(/* webpackChunkName: "Account.list" */'@/Views/account/list')
            }
          ]
        },
        {
          path: '/articles', component: ParentComp, meta: { title: '文章管理', auth: true },
          children: [
            {
              path: '/', meta: { title: '文章列表' },
              component: () => import(/* webpackChunkName: "ArticlesList" */'@/Views/articles/list')
            },
            {
              path: 'cates', meta: { title: '文章分类' },
              component: () => import(/* webpackChunkName: "ArticlesCates" */'@/Views/articles/cates')
            },
            {
              path: 'create', meta: { title: '添加文章' },
              component: () => import(/* webpackChunkName: "ArticlesCreate" */'@/Views/articles/create')
            },
            {
              path: 'edit/:id', meta: { title: '更新文章' },
              component: () => import(/* webpackChunkName: "ArticlesEdit" */'@/Views/articles/edit')
            }
          ]
        }
      ]
    }
  ]
}

const router = new Router(Vue.prototype.router)
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach((to, from) => {
  NProgress.done()
})
export default router
