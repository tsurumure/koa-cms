<template>

<el-dialog width="400px" title="修改密码" :visible.sync="isOpen" :before-close="ResetDialog">
  <el-form :model="datasForm" ref="Password_ref" :rules="datasRules" :disabled="$store.state.Account.Password_Loading">

    <el-alert center style="margin-bottom:15px;" title="提示：修改密码成功后，需要重新登录" :closable="false"></el-alert>

    <el-form-item label="原密码" prop="oldPassword">
      <el-input type="password" v-model="datasForm.oldPassword" placeholder="请输入原密码" @keyup.enter.native="datasSubmit()"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="password" v-model="datasForm.newPassword"  placeholder="6-16位大小写英文字母、数字、符号" @keyup.enter.native="datasSubmit()"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmPassword">
      <el-input type="password" v-model="datasForm.confirmPassword" placeholder="请确认新密码" @keyup.enter.native="datasSubmit()"></el-input>
    </el-form-item>

    <div align="center" style="margin-top:10px;">
      <el-button size="small" @click="ResetDialog()" :disabled="$store.state.Account.Password_Loading">取消</el-button>
      <el-button size="small" type="primary" @click="datasSubmit()" :loading="$store.state.Account.Password_Loading">提交</el-button>
    </div>
  </el-form>
</el-dialog>

</template>

<script>
import Cookie from 'vue-cookie'

import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  props: ['open'],
  watch: {
    open (v) { this.isOpen = v }
  },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  },
  methods: {
    ...mapActions({
      'UpdateMyPassword': 'Account/UpdateMyPassword'
    }),
    ResetDialog: function () {
      this.datasForm = {}
      this.$refs['Password_ref'].clearValidate()
      this.$emit('close')
    },
    datasSubmit: function () {
      this.$refs['Password_ref'].validate((valid) => {
        if (valid) {
          var datas = { uid: this.UserInfo.uid, oldPassword: this.datasForm.oldPassword, password: this.datasForm.newPassword }
          this.UpdateMyPassword(datas).then((rs) => {
            if (rs.data.status_code == 0) {
              this.$message({ type: 'success', message: rs.data.message })
              Cookie.delete('token')
              Cookie.delete('UserInfo')
              this.$router.push({path: '/login'})
            } else {
              this.$message({ type: 'error', message: rs.data.message })
            }
            this.$refs['Password_ref'].clearValidate()
            this.ResetDialog()
          })
        }
      })
    }
  },
  data () {
    var vm = this
    return {
      datasForm: {},
      isOpen: this.enabled,
      datasRules: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度必须在6-16之间', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度必须在6-16之间', trigger: 'blur' },
          { validator: this.$valid.Confirm({ vm: this, title: '密码', formName: 'datasForm', confirmName: 'oldPassword' }), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: this.$valid.Confirm_diff({ vm: this, title: '密码', formName: 'datasForm', confirmName: 'newPassword' }), trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
