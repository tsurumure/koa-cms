<template>
<el-main>

	<el-card>
		<h2 class="card_title">我的账号</h2>

    <el-form class="item-content" label-width="120px" label-position="left" size="mini">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="昵称"><span v-html="UserInfo.nickname"></span></el-form-item>
          <el-form-item label="最后登录IP"><span v-html="UserInfo.lastlogin_ip"></span></el-form-item>
          <el-form-item label="最后登录时间"><span v-html="UserInfo.lastlogin_at"></span></el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名"><span v-html="UserInfo.username"></span></el-form-item>
          <el-form-item label="手机"><span v-html="UserInfo.phone"></span></el-form-item>
          <el-form-item label="邮箱"><span v-html="UserInfo.email"></span></el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户权限">
            <el-tag type="info" v-html="UserInfo.level_name"></el-tag>
          </el-form-item>
          <el-form-item label="注册日期"><span v-html="UserInfo.created_at"></span></el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button size="mini" icon="el-icon-password" @click="isOpenMyPassword=true">修改密码</el-button>
        <el-button size="mini" icon="el-icon-edit-outline" @click="isOpenMyinfo=true">修改个人信息</el-button>
      </el-form-item>

    </el-form>

    <edit-my-password :open="isOpenMyPassword" @close="isOpenMyPassword=false"/>
    <edit-my-info :open="isOpenMyinfo" @close="isOpenMyinfo=false" :datas="UserInfo"/>

	</el-card>

</el-main>
</template>

<script>
/* eslint-disable */
import editMyPassword from './com.edit.mypassword'
import editMyInfo from './com.edit.myinfo'
import { mapActions, mapGetters } from 'vuex'
import filters from '@/filters/moment'
/* eslint-disable */
export default {
  filters,
  components: { editMyInfo, editMyPassword },
  mounted () {
    this.GetUserInfo()
  },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  },
  methods: {
    ...mapActions({
      'GetUserInfo': 'Public/GetUserInfo'
    })
  },
  data () {
    return {
      isOpenMyinfo: false, isOpenMyPassword: false
    }
  }
}
</script>
<style lang="less">
</style>
