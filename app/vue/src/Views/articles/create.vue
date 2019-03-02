<template>
<el-main>

	<el-card>

    <h2 class="card_title"><i class="el-icon-arrow-left" @click="$router.go(-1)"></i>创建文章</h2>

		<el-form :model="datasForm" ref="datasForm" :disabled="ArticleForm_Loading" :rules="datasRules">

      <div class="articleLayout">
        <div class="articleLayout_img">
          <div class="avatar-uploader" @click="isOpenUploadHead=true">
            <div v-if="!datasForm.image" class="el-upload"><i class="el-icon-plus avatar-uploader-icon"></i></div>
            <img v-if="datasForm.image" :src="datasForm.image" :onerror="errorImg"/>
          </div>
          <upload-head :open="isOpenUploadHead" @close="isOpenUploadHead=false" @bindImg="bindImg"></upload-head>
        </div>
        <div class="articleLayout_content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文章标题" prop="title">
                <el-input placeholder="请输入文章标题.." v-model="datasForm.title" @keyup.enter.native="datasSubmit('datasForm')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="选择分类" prop="cate">
                <el-cascader change-on-select :options="ArticlesCatesTree" style="width:100%" :disabled="ArticleCateTree_Loading"
                  @change="SelectArticleCate" :props='cascaderProps' v-model="CurrentCateValue">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新时间" prop="updated_at">
                <el-date-picker v-model="datasForm.updated_at" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :editable="false" placeholder="请选择日期.."></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文章概况" prop="general">
                <el-input type="textarea" :rows="3" placeholder="请输入文章概况，首行不带空格缩进的描述文字，不支持html样式" v-model="datasForm.general"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

			<el-form-item prop="content">

        <label slot="label">文章内容 <a href="javascript:;" @click="isOpenDialog_Helps_AppendVideo=true">如何上传视频？</a></label>
        <dialog-helps :open="isOpenDialog_Helps_AppendVideo" @close="isOpenDialog_Helps_AppendVideo=false"
          width="840" title="如何上传视频？" :img="require('../../assets/images/video_teach.jpg')"></dialog-helps>

        <el-popover :disabled="ArticleForm_Loading" ref="popover4" v-model="isPop_UploadImg" placement="bottom" trigger="click">
          <el-upload
            :on-success="UploadImg"
            :action="SConfig.api + '/api/Manager/Common/UploadImg'"
            :headers="{ 'Authorization' : 'Bearer ' + token }"
            accept=".jpg,.png,.bmp" :show-file-list="false"
            drag multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-popover>

        <quill-editor :disabled="ArticleForm_Loading" v-if="datasForm" v-model="datasForm.content" :options="editorOption">
          <div id="toolbar" slot="toolbar">

            <span class="ql-formats"><select class="ql-font">
              <option selected="selected"></option><option value="serif"></option><option value="monospace"></option>
            </select></span>
            <span class="ql-formats"><select class="ql-size">
              <option value="small"></option><option selected></option><option value="large"></option><option value="huge"></option>
            </select></span>
            <span class="ql-formats"><select class="ql-header" >
              <option value="1"></option><option value="2"></option><option value="3"></option>
              <option value="4"></option><option value="5"></option><option value="6"></option>
              <option selected="selected"></option>
            </select></span>

            <span class="ql-formats"><select class="ql-color">
              <option selected="selected"></option>
                <option value="#e60000"></option><option value="#ff9900"></option><option value="#ffff00"></option>
                <option value="#008a00"></option><option value="#0066cc"></option><option value="#9933ff"></option>
                <option value="#ffffff"></option><option value="#facccc"></option><option value="#ffebcc"></option>
                <option value="#ffffcc"></option><option value="#cce8cc"></option><option value="#cce0f5"></option>
                <option value="#ebd6ff"></option><option value="#bbbbbb"></option><option value="#f06666"></option>
                <option value="#ffc266"></option><option value="#ffff66"></option><option value="#66b966"></option>
                <option value="#66a3e0"></option><option value="#c285ff"></option><option value="#888888"></option>
                <option value="#a10000"></option><option value="#b26b00"></option><option value="#b2b200"></option>
                <option value="#006100"></option><option value="#0047b2"></option><option value="#6b24b2"></option>
            </select></span>
            <span class="ql-formats"><select class="ql-background">
              <option value="#000000"></option>
                <option value="#e60000"></option><option value="#ff9900"></option><option value="#ffff00"></option>
                <option value="#008a00"></option><option value="#0066cc"></option><option value="#9933ff"></option>
                <option selected="selected"></option>
                <option value="#facccc"></option><option value="#ffebcc"></option><option value="#ffffcc"></option>
                <option value="#cce8cc"></option><option value="#cce0f5"></option><option value="#ebd6ff"></option>
                <option value="#bbbbbb"></option><option value="#f06666"></option><option value="#ffc266"></option>
                <option value="#ffff66"></option><option value="#66b966"></option><option value="#66a3e0"></option>
                <option value="#c285ff"></option><option value="#888888"></option><option value="#a10000"></option>
                <option value="#b26b00"></option><option value="#b2b200"></option><option value="#006100"></option>
                <option value="#0047b2"></option><option value="#6b24b2"></option>
            </select></span>

            <span class="ql-formats"><button type="button" class="ql-bold" title="加粗"></button></span>
            <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
            <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
            <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
            <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
            <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
            <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
            <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
            <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>

            <span class="ql-formats">
              <select class="ql-align"><option selected="selected"></option>
              <option value="center"></option><option value="right"></option><option value="justify"></option>
            </select>
            </span>
              <span class="ql-formats"><button type="button" class="ql-clean"></button></span>
              <span class="ql-formats"><button type="button" class="ql-link"></button></span>

              <span class="ql-formats"><button type="button" v-popover:popover4>
                <svg viewBox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect><circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
              </button></span>
              <span class="ql-formats"><button type="button" class="ql-video"></button></span>

            </div>
        </quill-editor>

			</el-form-item>
			<el-form-item align="center">
					<el-button type="primary" @click="datasSubmit('datasForm')" :loading="ArticleForm_Loading">提交</el-button>
					<el-button @click="resetForm('datasForm')" :disabled="ArticleForm_Loading">清空</el-button>
			</el-form-item>
		</el-form>
	</el-card>

</el-main>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import { Cascader } from 'element-ui'
Vue.use(Cascader)

import Cookie from 'vue-cookie'
import moment from 'moment'
import { mapState, mapGetters, mapActions } from 'vuex'

// IE10 及以下不兼容
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Quill.register('modules/imageResize', ImageResize)

import uploadHead from '../public/bar/uploadHead'
import dialogHelps from '../public/bar/com.dialog.helps'

/* eslint-disable */

export default {
  components: { quillEditor, uploadHead, dialogHelps },
  mounted () {
    this.GetArticlesCatesList()
  },
  computed: {
    ...mapState({
      'ArticleForm_Loading': state => state.Articles.ArticleForm_Loading,
      'ArticleCateTree_Loading': state => state.Articles.ArticleCateTree_Loading,
      'ArticleDetail_Loading': state => state.Articles.ArticleDetail_Loading,
      'ArticleForm_Loading': state => state.Articles.ArticleForm_Loading
    }),
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    }),
    ArticlesCatesTree () {
      return this.$utils._toTree(this.$store.state.Articles.ArticleCateTree)
    }
  },
  methods: {
    ...mapActions({
      'GetArticlesCatesList': 'Articles/GetArticlesCatesList',
      'CreateArticle': 'Articles/CreateArticle'
    }),

    // 上传封面成功后返回图片文件路径
    bindImg: function (v) {
      this.$set(this.datasForm, 'image', `${this.SConfig.assets}/${v}`)
    },

    // [Click] 选择文章分类
    SelectArticleCate: function (id) {
      this.datasForm.cate_id = id[id.length - 1]
    },

    // [Post] 上传图片
    UploadImg: function (rs, file, fileList) {
      this.isPop_UploadImg = false
      if (rs.status_code == 0) {
        this.$message({ type: 'success', message: rs.message })
        this.$set(this.datasForm, 'content', `${this.datasForm.content} <img src="${this.SConfig.assets}/${rs.body}">`)
      } else {
        this.$message({ type: 'error', message: rs.message })
      }
    },

    datasSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.datasForm.author = this.UserInfo.nickname
          this.datasForm.author_id = this.UserInfo.uid
          this.CreateArticle(this.datasForm).then((rs) => {
            if (rs.data.status_code == 0) {
              this.$message({ type: 'success', message: rs.data.message })
              this.$router.push({path: '/articles'})
            } else {
              this.$message({ type: 'error', message: rs.data.message })
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$confirm('确认重置内容吗? (本页面所有内容将被清空)').then(_ => {
        this.$refs[formName].resetFields()
        this.datasForm.content = null
      })
    }
  },
  data () {
    return {
      token: Cookie.get('token'),
      fileList: [], isPop_UploadImg: false,
      editorOption: {
        placeholder: '请输入文章内容',
        modules: {
          toolbar: '#toolbar',
          imageResize: {
            modules: [ 'Resize', 'DisplaySize' ]
          }
        }
      },
      datasForm: {
        title: '', content: '', author: '', author_id: '', cate_id: 1,
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      datasRules: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
        created_at: [{ required: true, message: '创建时间不能为空', trigger: 'change' }],
        content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }]
      },
      CurrentCateValue: [1], cascaderProps: { value: 'id' },
      isOpenUploadHead: false,
      errorImg: '',
      isOpenDialog_Helps_AppendVideo: false
    }
  }
}
</script>

<style lang="less" scoped>
@import url(articles.less);
</style>
