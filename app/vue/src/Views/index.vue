<template>
<el-container :class="{'is-menu-active-parent':!$store.state.isAsideActive}"> <!--   -->
	<aside-component></aside-component>
	<el-container class="main-container is-vertical" :class="{'is-menu-active':!$store.state.isAsideActive}">
		<header-component></header-component>
		<!-- <transition :name="transitionName"> 暂不使用动画效果 -->
			<keep-alive v-if="$route.meta.keepAlive">
				<router-view class="view-main"></router-view>
			</keep-alive>
      <router-view class="view-view" v-if="!$route.meta.keepAlive"/>
		<!-- </transition> -->
		<el-footer>Powerby <a href="http://www.mure.space/" target="_blank">Mure</a> &copy; 2017-2018</el-footer>
    <!--  · <router-link to="/update_log">更新日志</router-link> -->
	</el-container>
</el-container>
</template>

<script>
import Cookie from 'vue-cookie'
import headerComponent from './public/header'
import asideComponent from './public/aside'

export default {
  components: { headerComponent, asideComponent }
  // data () {
  //   return {
  //     transitionName: 'view-main'
  //   }
  // },
  // watch: {
  //   '$route' (to, from) {
  //     console.log(this.$route.meta.keepAlive)
  //     // this.transitionName = 'view-main'
  //   }
  // }
}
</script>
<style lang="less">
</style>
