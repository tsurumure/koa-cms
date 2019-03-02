<template>

<el-dialog width="400px" title="修改账号信息" :visible.sync="isOpen" :before-close="ResetDialog">
  <el-form :model="datasForm" ref="UserInfo_ref" :rules="datasRules" :disabled="$store.state.Account.UserInfo_Loading">

    <el-alert center style="margin-bottom:15px;" title="提示：修改昵称将会同时修改发布过的文章「作者名」" :closable="false"></el-alert>

    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="datasForm.nickname" placeholder="请输入昵称" @keyup.enter.native="datasSubmit()"></el-input>
    </el-form-item>
    <el-row :gutter="15">
      <el-col :span="12" class="col-group">
        <el-form-item label="手机" prop="phone">
          <el-input v-model="datasForm.phone" placeholder="请输入手机号码" @keyup.enter.native="datasSubmit()"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="col-group">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="datasForm.email" placeholder="请输入邮箱地址" @keyup.enter.native="datasSubmit()"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div align="center" style="margin-top:10px;">
      <el-button size="small" @click="ResetDialog()" :disabled="$store.state.Account.UserInfo_Loading">取消</el-button>
      <el-button size="small" type="primary" @click="datasSubmit()" :loading="$store.state.Account.UserInfo_Loading">提交</el-button>
    </div>
  </el-form>
</el-dialog>

</template>

<script>
import Cookie from 'vue-cookie'

import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  props: ['open', 'datas'],
  watch: {
    open (v) { this.isOpen = v },
    // 初始化表单
    datas (v) { this.datasForm = JSON.parse(JSON.stringify(v)) }
  },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  },
  methods: {
    ...mapMutations({
      'GET_USER_INFO': 'Public/GET_USER_INFO'
    }),
    ...mapActions({
      'UpdateUserInfo': 'Account/UpdateUserInfo'
    }),
    ResetDialog: function () {
      this.datasForm = JSON.parse(JSON.stringify(this.datas))
      this.$refs['UserInfo_ref'].clearValidate()
      // this.CloseDialog()
      this.$emit('close')
    },
    datasSubmit: function () {
      this.$refs['UserInfo_ref'].validate((valid) => {
        if (valid) {
          this.datasForm.phone = this.datasForm.phone ? parseInt(this.datasForm.phone) : ''
          this.UpdateUserInfo(this.datasForm).then((rs) => {
            if (rs.data.status_code == 0) {
              this.GET_USER_INFO({ datas: this.datasForm})
              this.$message({ type: 'success', message: rs.data.message })
            } else {
              this.$message({ type: 'error', message: rs.data.message })
            }
            this.$refs['UserInfo_ref'].clearValidate()
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
      isOpen: false,
      datasRules: {
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ]
        // phone: [
        //   { validator: this.$valid.Phone(), trigger: 'blur' }
        // ],
        // email: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        // ]
      }
    }
  }
}
</script>
