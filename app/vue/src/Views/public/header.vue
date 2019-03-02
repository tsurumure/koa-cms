<template>
  <section class="view-header">
    <el-header>
      <el-row :gutter="10">
        <el-col :span="1">
          <el-button class="aside-menu-button" :class="{'isAsideActive':!$store.state.isAsideActive}" @click="$store.state.isAsideActive=!$store.state.isAsideActive">
            <span class="cv-menu"><i></i></span>
          </el-button>
        </el-col>
        <el-col :span="15"><h1 v-html="$route.meta.title"></h1></el-col>
        <el-col :span="8">
          <div class="header-userInfo">
            <div class="item item-name"><router-link :to="'/account/my'"><span v-html="UserInfoSimple"></span></router-link></div>
            <!-- <el-badge :value="120" class="item" :max="99" is-dot>
              <a href="javascript:;"><i class="el-icon-bell"></i></a>
            </el-badge> -->
            <!-- <div class="item"><router-link :to="'/account'"><i class="el-icon-setting"></i></router-link></div> -->
            <div class="item"><a href="javascript:;" v-on:click="Logout()"><i class="el-icon-logout"></i></a></div>
          </div>
        </el-col>
      </el-row>
      <div class="clearfix"></div>
    </el-header>
    <div class="header-tab-inner">
      <el-tabs v-model="activePath" type="card" :closable="tabsOptions.length>1"
        @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane class="noClose" v-for="(item) in tabsOptions"
          :key="item.name" :label="item.name" :name="item.route">
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-breadcrumb v-if="$route.path!='/'" separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-home"></i></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: item.path }"
        v-for="(item, index) in $route.matched"
        v-if="index > 0" :key="item.path">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </section>
</template>
<script>
import Cookie from 'vue-cookie'
import store from '@/store'

import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['title'],
  mounted () {
    this.GetUserInfo()
  },
  computed: {
    ...mapGetters({
      'UserInfoSimple': 'Public/UserInfoSimple'
    }),
    tabsOptions () {
      return this.$store.state.tabs.tabsOptions
    },
    activePath: {
      get () {
        return this.$store.state.tabs.activePath
      },
      set (val) {
        this.$store.commit('set_active_index', val)
      }
    }
  },
  watch: {
    '$route' (to) {
      let flag = false
      let path = to.path.split('/')

      for (let option of this.tabsOptions) {
        if (option.name === to.meta.title) {
          flag = true
          if (Object.keys(to.params).length > 0) {
            this.$store.commit('set_active_index', option.route)
          } else {
            this.$store.commit('set_active_index', to.path)
          }
          break
        }
      }

      if (!flag) {
        this.$store.commit('add_tabs', { route: to.path, name: to.meta.title})
        this.$store.commit('set_active_index', to.path)
      }
    }
  },
  methods: {
    //
    // tab切换时，动态的切换路由
    tabClick (tab) {
      this.$router.push({path: this.activePath})
    },
    tabRemove (targetName) {
      // 首页不可删除
      if (targetName == '/') {
        return
      }
      this.$store.commit('delete_tabs', targetName)
      if (this.activePath === targetName) {
        // 设置当前激活的路由
        if (this.tabsOptions && this.tabsOptions.length >= 1) {
          this.$store.commit('set_active_index', this.tabsOptions[this.tabsOptions.length - 1].route)
          this.$router.push({path: this.activePath})
        } else {
          this.$router.push({path: '/'})
        }
      }
    },

    ...mapActions({
      'GetUserInfo': 'Public/GetUserInfo',
      'PostLogout': 'Public/PostLogout'
    }),
    Logout () {
      if (Cookie.get('token')) {
        this.$confirm('退出登录吗?').then(() => {
          this.PostLogout(Cookie.get('token')).then(() => {
            Cookie.delete('token')
            Cookie.delete('UserInfo')
            this.$store.state.Public.UserInfo = { nickname: 'Loading..', level_name: '-' }
            this.$store.commit('clear_tabs')
            this.$router.push({path: '/login'})
          })
        }).catch(_ => {})
      }
    }
    //
  },
  data () {
    this.$nextTick(() => {
      this.$store.commit('add_tabs', {route: this.$route.path, name: this.$route.meta.title})
      this.$store.commit('set_active_index', this.$route.path)
      // let flag = false
      // for (let option of this.$store.state.tabs.tabsOptions) {
      //   if (option.route == '/') flag = true; break
      // }
      // if (!flag) {
      //   this.$store.commit('add_tabs', {route: '/', name: '管理首页'})
      //   this.$store.commit('set_active_index', '/')
      // }
    })
    return {
    }
  }
}
</script>
<style lang="less" scoped>
@import url(public.less);
</style>
