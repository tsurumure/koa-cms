<template>
  <div>
    <!-- :close-on-click-modal="false" -->
    <el-dialog title="上传图片" width="740px" :visible.sync="isOpen" :before-close="closeUploadHead">
      <div class="cropperUploadHead" v-loading="UploadImg_Loading">
        <el-row>
          <el-col :span="14">

            <el-upload drag v-if="!tempUploadImg" class="large-uploader"
              :on-change="UploadImgFile" :auto-upload="false" :action="``">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br></div>
            </el-upload>

            <div class="cropper-container" v-if="tempUploadImg">
              <vue-cropper
                ref="cropper" :img="tempUploadImg" @realTime="realTime"
                :autoCrop="true" :fixed="true" :fixedBox = "true" :fixedNumber=[1,1] :info="false"
                :autoCropWidth="280" :autoCropHeight="280"
              ></vue-cropper>
            </div>

          </el-col>

          <el-col :span="10" align="center">
            <div class="previews">
              <h4>实时预览</h4>
                <div class="show-preview medium">
                  <i v-if="!previews" class="el-icon-image"></i>
                  <img v-if="previews" :src="previews" />
                  <p>120 x 120</p>
                </div>
                <div class="show-preview small">
                  <i v-if="!previews" class="el-icon-image"></i>
                  <img v-if="previews" :src="previews" />
                  <p>65 x 65</p>
                </div>
            </div>
            <div class="notices">
              <dl>
                <dt>第一步：选择图片上传</dt>
                <dd>建议上传宽/高度大于400px的图片</dd>
              </dl>
              <dl>
                <dt>第二步：调整图片</dt>
                <dd>拖拽方框，调整图片的位置和尺寸</dd>
              </dl>
              <dl>
                <dt>第三步：预览并保存图片</dt>
                <dd>点击 [保存] 按钮完成操作</dd>
              </dl>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="closeUploadHead">取消</el-button>
        <el-button type="info" @click="ResetUpload" v-if="tempUploadImg">重置</el-button>
        <el-button type="primary" @click="UploadHeadPic" :disabled="UploadImg_Loading">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// https://github.com/xyxiao001/vue-cropper
// http://xyxiao.cn/vue-cropper/example/
// Style: https://forum.vuejs.org/t/vue/4427
import vueCropper from 'vue-cropper'
import { mapState, mapActions } from 'vuex'
export default {
  components: { vueCropper },
  props: ['open'],
  watch: {
    open (v) { this.isOpen = v }
  },
  computed: {
    ...mapState({
      'UploadImg_Loading': state => state.Public.UploadImg_Loading
    })
  },
  methods: {
    ...mapActions({
      'UploadImgByBase64': 'Public/UploadImgByBase64'
    }),
    // [Close] 上传头像
    closeUploadHead () { this.$emit('close'); this.ResetUpload() },

    // [UploadFile] 拖动/上传图片文件
    UploadImgFile (file, fileList) {
      this.tempUploadImg = file.url
    },
    // [UploadFile] 清除/重置
    ResetUpload () {
      this.tempUploadImg = ''
      this.previews = ''
      // this.previews = this.CurrentUser.HeadPic
    },
    // [Post] 上传头像
    UploadHeadPic () {
      let vm = this
      if (this.previews) {
        this.UploadImgByBase64({ base64: this.previews }).then(rs => {
          if (rs.data.status_code == 0) {
            vm.$message({ type: 'success', message: rs.data.message })
            vm.$emit('close')
            vm.$emit('bindImg', rs.data.body)
            vm.tempUploadImg = ''
            vm.previews = ''
          } else {
            vm.$message({ type: 'error', message: rs.data.message })
          }
        })
      }
    },
    // 实时预览函数
    realTime (data) {
      this.$refs['cropper'].getCropData((rs) => {
        this.previews = rs
      })
    }
  },
  data () {
    return {
      isOpen: false, tempUploadImg: '', previews: '', small_previews: ''
    }
  }
}
</script>
<style lang="less" scoped>
@import url(uploadHead.less);
</style>
