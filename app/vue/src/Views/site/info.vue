<template>
	<el-main>
		<el-card>

      <h2 class="card_title">
        网站信息
        <em><i class="el-icon-key"></i>管理员可见</em>
        <div class="right" style="font-size: 14px; display: none;">
          是否启用网站：
          <el-switch v-model="datasForm.is_active" active-color="#13ce66" inactive-color="#cccccc">
          </el-switch>
        </div>
      </h2>

			<el-form :model="datasForm" ref="datasForm" :rules="datasRules" v-loading="isPosting">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="网站标题(Title)" prop="title">
							<el-input placeholder="请输入网站标题，建议不超过100个字符" :disabled="isPosting"  v-model="datasForm.title" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="网站关键词(Keyword)" prop="keyword">
							<el-input placeholder="请输入网站关键词，建议不超过200个字符" :disabled="isPosting"  v-model="datasForm.keyword" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="网站描述(Description)" prop="description">
							<el-input type="textarea" placeholder="请输入网站描述，建议不超过200个字符" :rows="6" :disabled="isPosting"  v-model="datasForm.description" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
						</el-form-item>
					</el-col>

					<!-- 版权所有 © 2017-2018 汕头市盛安建筑脚手架有限公司 -->
					<el-col :span="12">
						<el-form-item label="版权声明" prop="copyright">
							<el-input placeholder="请输入版声明，例如：版权所有 © 2017-2018 XXX有限公司" :disabled="isPosting" v-model="datasForm.copyright" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="备案号" prop="icp">
							<el-input placeholder="请输入网站备案号" :disabled="isPosting"  v-model="datasForm.icp" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
						</el-form-item>
					</el-col>

				</el-row>

				<el-form-item align="center">
						<el-button type="primary" @click="datasSubmit('datasForm')" :loading="isPosting">提交</el-button>
				</el-form-item>

			</el-form>

		</el-card>
	</el-main>
</template>

<script>
import Cookie from 'vue-cookie'
export default {
  mounted () {
    var vm = this
    vm.GetSiteInfo()
  },
  methods: {
    GetSiteInfo: function () {
      var vm = this
      vm.isPosting = true
      vm.axios.get('/api/Manager/Site/GetSiteInfo', {
        headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
      }).then((rs) => {
        vm.isPosting = false
        if (rs.data != 'null') {
          vm.datasForm = rs.data
        }
      }, (err) => { vm.globals.tokenError(vm, err) })
    },
    datasSubmit: function (formName) {
      var vm = this
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.isPosting = true
          /* Post */
          vm.axios.post('/api/Manager/Site/UpdateSiteInfo', vm.datasForm, {
            headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
          }).then((rs) => {
            vm.isPosting = false
            if (rs.data.status_code == 0) {
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
    return {
      isPosting: false,
      datasForm: { title: '', keyword: '', description: ''},
      datasRules: {
        title: [{ required: true, message: '网站标题不能为空', trigger: 'blur' }],
        keyword: [{ required: true, message: '网站关键词不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '网站描述不能为空', trigger: 'blur' }],
        copyright: [{ required: true, message: '版权声明不能为空', trigger: 'blur' }],
        icp: [{ required: true, message: '备案号不能为空', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
