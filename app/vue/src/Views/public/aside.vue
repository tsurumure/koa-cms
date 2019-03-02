<template>
	<el-aside :width="$store.state.isAsideActive ? '200px' : '64px'"> <!--  :width="$store.state.isAsideActive ? '200px' : '50px'" -->
		<div class="header-logo" v-html="$store.state.isAsideActive ? '管理中心':'管'"></div>
		<el-menu :default-active="$route.path" :router="true"
      :collapse="!$store.state.isAsideActive"
      class="el-menu-aside">
			<el-menu-item index="/">
				<i class="el-icon-home_inside"></i><span slot="title">管理首页</span>
			</el-menu-item>

      <el-submenu index="/site_info" v-level="UserInfo">
        <template slot="title"><i class="el-icon-list"></i><span>网站管理</span></template>
        <el-menu-item index="/site/info"><span slot="title">网站信息<i class="el-icon-key"></i></span></el-menu-item>
        <el-menu-item index="/site/banner"><span slot="title">轮播图片<i class="el-icon-key"></i></span></el-menu-item>
        <el-menu-item index="/friend_links"><span slot="title">友情链接<i class="el-icon-key"></i></span></el-menu-item>
      </el-submenu>

      <!-- el-menu-item 子组件刷新无法使用 自定义指令 获得最新数据 -->
      <el-submenu index="/articles">
        <template slot="title"><i class="el-icon-article"></i><span>文章管理</span></template>
        <el-menu-item index="/articles"><span slot="title">所有文章</span></el-menu-item>
        <el-menu-item index="/articles/cates" v-if="UserInfo.level_id == 1 || UserInfo.level_id == 2"><span slot="title">编辑文章分类<i class="el-icon-key"></i></span></el-menu-item>
        <el-menu-item index="/articles/create"><span slot="title">创建文章</span></el-menu-item>
      </el-submenu>

			<el-submenu index="/account">
        <template slot="title"><i class="el-icon-member"></i><span>账号管理</span></template>
        <el-menu-item index="/account/my"><span slot="title">我的账号</span></el-menu-item>
        <el-menu-item index="/account/list" v-if="UserInfo.level_id == 1 || UserInfo.level_id == 2"><span slot="title">全部账号<i class="el-icon-key"></i></span></el-menu-item>
			</el-submenu>

      <!-- <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i><span>导航一</span></template>
        <el-menu-item index="/site_info"><span slot="title">链接111</span></el-menu-item>
        <el-menu-item index="/1"><span slot="title">链接#</span></el-menu-item>
        <el-menu-item-group>
          <template slot="title"><span>分组一</span></template>
          <el-menu-item index="/4"><span slot="title">其他#</span></el-menu-item>
        </el-menu-item-group>
        <el-menu-item index="/3"><span slot="title">链接#</span></el-menu-item>
      </el-submenu> -->

		</el-menu>
	</el-aside>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  methods: {
  },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  }
}
</script>

<style lang="less">
@import url(public.less);
</style>
