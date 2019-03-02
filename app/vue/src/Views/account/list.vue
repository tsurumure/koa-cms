<template>
<el-main>

	<el-card>
		<h2 class="card_title">
      账号管理
      <em><i class="el-icon-key"></i>管理员可见</em>
      <div class="right">
        <el-button size="mini" icon="el-icon-circle-plus-outline" type="primary" v-level="UserInfo"
           @click="isDialogCreate=true">新增账号</el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="GetUsersList()" :loading="$store.state.Account.UsersList_Loading">刷新账号</el-button>
        <create-user :disabled="isDialogCreate" @close="isDialogCreate=false" @refresh="GetUsersList"></create-user>
      </div>
    </h2>

		<el-table :data="UsersList" v-loading="$store.state.Account.UsersList_Loading" :empty-text="`暂无数据`"
      :row-key="getRowKeys" :expand-row-keys="expands" @row-click="toggleRowExpansion">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="用户名"><span>{{ props.row.username}}</span></el-form-item>
            <el-form-item label="手机"><span>{{ props.row.phone}}</span></el-form-item>
            <el-form-item label="邮箱"><span>{{ props.row.email}}</span></el-form-item>
            <el-form-item label="注册日期">
              <i class="el-icon-time"></i>
              <span>{{ props.row.created_at | curtime }}</span>
            </el-form-item>
            <el-form-item label="操作" v-if="UserInfo.level_id == 1 || props.row.level_id!=2">
              <el-button size="mini" icon="el-icon-password" @click="ClickResetPassword(props.row)">重置密码</el-button>
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="ClickRemoveUser(props.row)">删除</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

			<el-table-column prop="nickname" label="昵称"></el-table-column>
			<el-table-column prop="level_name" label="权限"></el-table-column>
			<el-table-column prop="lastlogin_at" label="最近登录日期">
				<template slot-scope="scope">
					<i class="el-icon-time"></i>
					<span :class="{ success : isNaN(new Date(scope.row.lastlogin_at).getTime())}">{{ scope.row.lastlogin_at | curtime | unused }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="lastlogin_ip" label="最近登录IP"></el-table-column>
		</el-table>
	</el-card>

</el-main>
</template>

<script>
/* eslint-disable */
import Cookie from 'vue-cookie'
import editMyInfo from './com.edit.myinfo'
import createUser from './com.create.user'

import { mapActions, mapGetters } from 'vuex'

import filters from '@/filters/moment'
/* eslint-disable */
export default {
  filters,
  components: { editMyInfo, createUser },
  mounted () {
    this.GetUserInfo()
    this.GetUsersList()
  },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo',
      'UsersList': 'Account/UsersList'
    })
  },
  methods: {
    ...mapActions({
      'GetUserInfo': 'Public/GetUserInfo',
      'GetUsersList': 'Account/GetUsersList',
      'ResetPassword': 'Account/ResetPassword',
      'RemoveUser': 'Account/RemoveUser'
    }),
    // [Click] 重置密码
    ClickResetPassword: function (row) {
      this.$confirm(`此用户密码将重置为「123456」，确认重置吗?`).then(_ => {
        this.ResetPassword({ uid: row.uid }).then(rs => {
          if (rs.data.status_code == 0) {
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    },
    // [Click] 删除用户
    ClickRemoveUser: function (row) {
      this.$confirm(`确定删除此用户吗? (已发布的文章作者名不会清除)`).then(_ => {
        this.RemoveUser({ uid: row.uid }).then(rs => {
          if (rs.data.status_code == 0) {
            this.GetUsersList()
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    },
    // <el-table 手风琴
    getRowKeys (row) { return row.id },
    toggleRowExpansion (row) {
      this.expands = []; this.expands.push(row.id)
    }
  },
  data () {
    return {
      expands: [],
      isOpenMyinfo: false, isOpenMyPassword: false,
      isDialogCreate: false
    }
  }
}
</script>
<style lang="less">
@import 'list.less';
</style>
