<template>
	<el-main>
		<el-card>

      <h2 class="card_title">
        轮播图片
        <em><i class="el-icon-key"></i>管理员可见</em>
        <div class="right">
          <em><i class="el-icon-sort"></i>拖动即可更改图片顺序</em>
        </div>
      </h2>

      <update-banner :open="isUpdateBanner" :data="curUpdateBanner" @close="isUpdateBanner=false; curUpdateBanner={}" @refresh="GetBannerList"></update-banner>

      <el-table style="margin-bottom: 20px;" :data="BannerList" v-loading="$store.state.Site.Banner_Loading || isPosting" :empty-text="`暂无数据`">
        <el-table-column prop="image" label="图片" width="200">
          <template slot-scope="scope">
            <img class="banner_thumb" :src="SConfig.assets + '/' + scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="200"></el-table-column>
        <el-table-column prop="url" label="链接"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="openDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
		</el-card>

    <el-card>
      <h2 class="card_title">新增轮播图片</h2>
      <el-form :model="datasForm" ref="datasForm" :rules="datasRules" v-loading="isPosting">
        <el-row :gutter="20">
					<el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input placeholder="请输入标题" :disabled="isPosting" v-model="datasForm.title" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
            </el-form-item>
					</el-col>
          <el-col :span="12">
            <el-form-item label="链接" prop="title">
              <el-input placeholder="请输入链接" :disabled="isPosting" v-model="datasForm.url" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
            </el-form-item>
					</el-col>
          <el-col :span="6">
            <el-form-item label="图片路径" prop="image">
              <el-input placeholder="请上传图片" :disabled="true" v-model="datasForm.image"></el-input>
            </el-form-item>
					</el-col>
          <el-col :span="24">
            <small class="tip">建议上传图片尺寸为 <b>830x300</b> (px)，支持 JPG/PNG/BMP 格式</small>
            <img class="banner_preview" v-if="datasForm.image" :src="SConfig.assets + '/' + datasForm.image"/>
          </el-col>
        </el-row>
				<el-form-item>
          <el-upload style="display: inline; margin-right: 10px;" :on-success="UploadImg" :auto-upload="true" accept=".jpg,.png,.bmp" :show-file-list="false"
            :action="'/api/Manager/Common/UploadImg'" :headers="{ 'Authorization' : 'Bearer ' + token }">
            <el-button type="info">上传图片</el-button>
          </el-upload>
          <el-button type="primary" @click="datasSubmit('datasForm')" :loading="isPosting">提交</el-button>
				</el-form-item>
			</el-form>
    </el-card>

	</el-main>
</template>

<script>
import Cookie from 'vue-cookie'
import Sortable from 'sortablejs'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import updateBanner from './com.update.banner'

export default {
  components: { updateBanner },
  mounted () {
    this.GetBannerList()
    this.rowDrop()
  },
  computed: {
    ...mapGetters({
      'BannerList': 'Site/BannerList'
    }),
    ...mapState({
      'BannerList_Loading': state => state.Site.BannerList_Loading
    })
  },
  methods: {
    ...mapActions({
      'GetBannerList': 'Site/GetBannerList',
      'CreateBanner': 'Site/CreateBanner',
      'DeleteBanner': 'Site/DeleteBanner',
      'SortBanner': 'Site/SortBanner'
    }),
    UploadImg (rs, file, fileList) {
      if (rs.status_code == 0) {
        this.$message({ type: 'success', message: rs.message })
        this.$set(this.datasForm, 'image', rs.body)
      } else {
        this.$message({ type: 'error', message: rs.message })
      }
    },

    openEdit (row) {
      this.isUpdateBanner = true
      this.curUpdateBanner = row
    },

    openDelete (id) {
      let vm = this
      vm.$confirm('确认删除此条轮播(Banner)吗?').then(_ => {
        //
        vm.isPosting = true
        vm.DeleteBanner({ id }).then(rs => {
          vm.isPosting = false
          if (rs.data.status_code == 0) {
            vm.$message({ type: 'success', message: rs.data.message })
          } else {
            vm.$message({ type: 'error', message: rs.data.message })
          }
          vm.GetBannerList()
        })
        //
      }).catch(_ => {})
    },
    datasSubmit: function (formName) {
      var vm = this
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.isPosting = true
          /* Post */
          vm.datasForm.sort = vm.BannerList.length
          vm.CreateBanner(vm.datasForm).then((rs) => {
            vm.isPosting = false
            if (rs.data.status_code == 0) {
              vm.$message({ type: 'success', message: rs.data.message })
              this.GetBannerList()
            } else {
              vm.$message({ type: 'error', message: rs.data.message })
            }
            vm.$refs[formName].clearValidate()
            vm.$refs[formName].resetFields()
            vm.datasForm = {}
          }, (err) => { vm.globals.tokenError(vm, err) })
          /* End Post */
        }
      })
    }
  },
  data () {
    return {
      token: Cookie.get('token'),
      isPosting: false,
      datasForm: { title: '', image: '', url: ''},
      datasRules: {
        title: [{ required: true, message: '图片标题不能为空', trigger: 'blur' }],
        image: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '链接不能为空', trigger: 'blur' }]
      },
      // Sortable 拖拽
      rowDrop () {
        let tbody = document.querySelector('.el-table__body-wrapper tbody')
        let vm = this
        Sortable.create(tbody, {
          onEnd ({ newIndex, oldIndex }) {
            if (newIndex != oldIndex) {
              vm.isPosting = true
              vm.SortBanner({ newId: vm.BannerList[newIndex].id, oldId: vm.BannerList[oldIndex].id }).then(rs => {
                vm.isPosting = false
                vm.$message({ type: 'success', message: rs.data.message })
              })
            }
          }
        })
      },
      isUpdateBanner: false,
      curUpdateBanner: {}
    }
  }
}
</script>

<style lang="less" scoped></style>
