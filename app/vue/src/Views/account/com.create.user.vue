<template>
<div>

<el-dialog width="400px" title="新增账号" :visible.sync="openStatus" @close="CancelDialog">
  <el-form :model="datasForm" ref="datasForm" :rules="datasRules">

    <el-alert type="success" center style="margin-bottom:15px;" title="新用户初始密码为 123456" :closable="false"></el-alert>

    <!-- <el-form-item label="选择用户组" prop="level_id">
      <el-select style="width:100%;" v-model="auth" :disabled="isPosting" @change="ChangeAuth" value-key="level_id" placeholder="请选择">
        <el-option v-for="item in select_auth" :label="item.level_name" :key="item.level_id" :value="item">
        </el-option>
      </el-select>
    </el-form-item>  -->

    <el-form-item label="选择用户组" prop="level_id">
      <el-select style="width:100%;margin:0;" v-model="datasForm.level_id" :disabled="isPosting" @change="ChangeAuth" value-key="level_id" placeholder="请选择">
        <el-option v-for="item in select_auth" :label="item.level_name" :key="item.level_id" :value="item.level_id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="用户名" prop="username">
      <el-input v-model="datasForm.username" placeholder="大小写英文字母、数字、符号，不超过16个字符" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
    </el-form-item>

    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="datasForm.nickname" placeholder="请输入昵称.." @keyup.enter.native="datasSubmit('datasForm')"></el-input>
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="手机" prop="phone">
          <el-input v-model="datasForm.phone" placeholder="请输入手机号码.." @keyup.enter.native="datasSubmit('datasForm')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="datasForm.email" placeholder="请输入邮箱地址.." @keyup.enter.native="datasSubmit('datasForm')"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div align="center" style="margin-top:10px;">
      <el-button size="small" @click="CancelDialog" :disabled="isPosting">取消</el-button>
      <el-button size="small" type="primary" @click="datasSubmit('datasForm')" :loading="isPosting">提交</el-button>
    </div>

  </el-form>
</el-dialog>

</div>
</template>

<script>
import Cookie from 'vue-cookie'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  props: ['disabled'],
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  },
  watch: {
    disabled (v) { this.openStatus = v }
  },
  mounted () {
    if (this.UserInfo.level_id == 1) {
      this.select_auth.push({ level_id: 2, level_name: '管理员' })
    }
  },
  methods: {
    ChangeAuth: function (v) {
      var vm = this, level_id = '', level_name = ''
      switch (v) {
        case 2: level_id = v; level_name = '管理员'; break
        case 3: level_id = v; level_name = '普通'; break
      }
      vm.$set(vm.datasForm, 'level_id', level_id)
      vm.$set(vm.datasForm, 'level_name', level_name)
      // vm.$refs['datasForm'].validate((valid)=>{});
      // vm.$refs['datasForm'].validate((valid)=>{});
    },
    CancelDialog: function () {
      var vm = this
      vm.openStatus = false
      vm.$refs['datasForm'].resetFields()
      vm.$emit('close', true)
    },
    datasSubmit: function (formName) {
      var vm = this
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.isPosting = true

          /* Post */
          vm.datasForm.lastlogin_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          vm.axios.post('/api/Manager/User/CreateUser', vm.datasForm, {
            headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
          }).then((rs) => {
            vm.isPosting = false
            vm.CancelDialog()
            if (rs.data.status_code == 0) {
              Cookie.delete('UserInfo')
              vm.$emit('refresh', true)
              vm.$message({ type: 'success', message: rs.data.message })
            } else {
              vm.$message({ type: 'error', message: rs.data.message })
            }
          }, (err) => { vm.globals.tokenError(vm, err) })
          /* End Post */
        }
      })
    }
  },
  data () {
    var vm = this
    var validatePhone = (rule, val, callback) => {
      if (val == '') {
        callback(new Error('手机不能为空'))
      } else {
        if (!val.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
          callback(new Error('请输入正确的手机格式'))
        } else {
          callback()
        }
      }
    }

    return {
      select_auth: [
        // { level_id: 2, level_name: '管理员' },
        { level_id: 3, level_name: '普通' }
      ],
      isPosting: false,
      openStatus: this.disabled,
      datasForm: {
        username: '', nickname: '', phone: '', email: '',
        level_id: '', level_name: '',
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      datasRules: {
        level_id: [{ required: true, message: '必须选择一个用户组', trigger: 'change' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'change' }]
        // nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        // phone: [{ validator: validatePhone, trigger: 'change' }],
        // email: [
        //   // { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
        // ]
      }
    }
  }
}
</script>
