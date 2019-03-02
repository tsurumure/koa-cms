<template>
<el-main>

	<el-card>
		<h2 class="card_title">测试</h2>

		<div class="table-el-row">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-upload :file-list="fileList" class="upload-demo"
						:show-file-list="false" accept=".xls" :on-success="UploadSuccess" :on-change="UploadChange"
						:headers="{ 'Authorization' : 'Bearer ' + token }"
						:action="globals.api + '/api/Manager/test/ImportExcel'">
						<el-button size="small" type="primary">上传 Excel 文件</el-button>
					</el-upload>
				</el-col>
				<el-col :span="12" align="right">
					<el-button size="small" @click="ClearExcels" :disabled="Excels.length<=0">清空</el-button>
				</el-col>
			</el-row>
		</div>

		<el-table :data="Excels" v-loading="isPosting">
			<el-table-column prop="OrgName" label="单位名称" width="300" fixed></el-table-column>
			<el-table-column prop="OrgAddress" label="单位地址"></el-table-column>
			<el-table-column prop="ZipCode" label="邮政编码" width="100"></el-table-column>
			<el-table-column prop="OrgMedicalCode" label="医疗机构代码" width="120"></el-table-column>
			<el-table-column prop="OrgArea" label="所属区" width="100"></el-table-column>
			<el-table-column prop="OrgStreet" label="所属街道" width="120"></el-table-column>
		</el-table>

	</el-card>

</el-main>
</template>

<script>
import Cookie from 'vue-cookie'
import moment from 'moment'

export default {
  mounted () {
    var vm = this
    //
    vm.GetExcel()
  },
  methods: {
    GetExcel: function (rs, file) {
      var vm = this
      vm.isPosting = true
      vm.axios.get('/api/Manager/test/GetExcel', {
        headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
      }).then((rs) => {
        vm.isPosting = false
        vm.Excels = rs.data.list
      }, (err) => { vm.globals.tokenError(vm, err) })
    },
    UploadChange: function () {
      var vm = this
      vm.isPosting = true
    },
    UploadSuccess: function () {
      var vm = this
      vm.$message({ type: 'success', message: '上传成功' })
      vm.GetExcel()
    },
    ClearExcels: function () {
      var vm = this
      vm.$confirm('确认清空记录吗?').then(_ => {
        vm.axios.post('/api/Manager/test/ClearExcel', '', {
          headers: { 'Authorization': 'Bearer ' + Cookie.get('token') }
        }).then((rs) => {
          vm.isPosting = false
          if (rs.data.status_code == 0) {
            vm.Excels = []
            vm.$message({ type: 'success', message: rs.data.message })
          } else {
            vm.$message({ type: 'error', message: rs.data.message })
          }
        }, (err) => { vm.globals.tokenError(vm, err) })
      }).catch(_ => {})
    }
  },
  data () {
    return {
      token: Cookie.get('token'),
      Excels: [],
      fileList: [],
      isPosting: false
    }
  }
}
</script>
<style lang="scss">
</style>
