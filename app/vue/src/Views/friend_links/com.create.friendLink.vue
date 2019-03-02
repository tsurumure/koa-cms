<template>
<div>
  <el-dialog width="30%" title="新增友情链接" :visible.sync="openStatus" @close="CancelDialog">
    <el-form :model="datasForm" ref="datasForm" :rules="datasRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="datasForm.title" placeholder="请输入标题" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="datasForm.url" placeholder="请输入网址，使用 http:// 开头" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
      </el-form-item>
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
import { mapState, mapActions } from 'vuex'

export default {
  props: ['open'],
  watch: {
    open (v) { this.openStatus = v }
  },
  methods: {
    ...mapActions({
      'GetFriendLinks': 'FriendLinks/GetFriendLinks',
      'CreateFriendLink': 'FriendLinks/CreateFriendLink'
    }),
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
          vm.CreateFriendLink(vm.datasForm).then(rs => {
            vm.isPosting = false
            vm.CancelDialog()
            if (rs.data.status_code == 0) {
              vm.$message({ type: 'success', message: rs.data.message })
              vm.GetFriendLinks()
            } else {
              vm.$message({ type: 'error', message: rs.data.message })
            }
          })
        }
      })
    }
  },
  data () {
    var vm = this
    return {
      isPosting: false, openStatus: false,
      datasForm: { title: '', url: '' },
      datasRules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        url: [{ required: true, message: '链接不能为空', trigger: 'change' }]
      }
    }
  }
}
</script>
