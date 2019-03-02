<template>
<div>
  <el-dialog width="30%" title="导出为 Excel 文件" :visible.sync="openStatus" @close="CancelDialog">
    <el-form ref="datasForm">

      <!-- {{ filterData }} -->

      <el-form-item label="选择日期范围">
        <el-date-picker v-model="filterData.date" type="daterange" align="right" unlink-panels
          range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"
          :picker-options="startEndOptions">
        </el-date-picker>
      </el-form-item>

      <!-- {{ArticlesCatesTree}} -->

      <!-- <el-form-item label="选择文章分类">
        <el-cascader change-on-select :options="ArticlesCatesTree" style="width:100%" :disabled="ArticleCateTree_Loading"
          @change="SelectArticleCate" :props='cascaderProps' v-model="CurrentCateValue">
        </el-cascader>
      </el-form-item>

      <el-form-item label="已选分类">
        <el-tag type="info" closable>111</el-tag>
        <el-tag type="info" closable>222</el-tag>
      </el-form-item> -->

      <el-alert center style="margin-bottom:15px;" v-if="!filterData.date && !filterData.cate_id"
        title="提示：默认将导出所有文章" :closable="false"></el-alert>

      <div align="center" style="margin-top:30px;">
        <el-button size="small" @click="CancelDialog" :disabled="isPosting">取消</el-button>
        <el-button size="small" type="primary" @click="datasSubmit()" :loading="isPosting">导出 Excel</el-button>
      </div>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import Cookie from 'vue-cookie'
import { mapState, mapActions } from 'vuex'
// import Vue from 'vue'
// import { Cascader } from 'element-ui'
// Vue.use(Cascader)

export default {
  props: ['open'],
  watch: {
    open (v) { this.openStatus = v }
  },
  mounted () {
    this.GetArticlesCatesList()
  },
  computed: {
    ...mapState({
      'ArticleCateTree_Loading': state => state.Articles.ArticleCateTree_Loading
    }),
    ArticlesCatesTree () {
      return this.$utils._toTree(this.$store.state.Articles.ArticleCateTree)
    }
  },
  methods: {
    ...mapActions({
      'GetArticlesCatesList': 'Articles/GetArticlesCatesList'
    }),
    // [Click] 选择文章分类
    SelectArticleCate: function (id) {
      this.filterData.cate_id = id[id.length - 1]
    },

    CancelDialog: function () {
      var vm = this
      vm.openStatus = false
      vm.$refs['datasForm'].resetFields()
      vm.filterData = { date: '', cate_id: '' }
      vm.$emit('close', true)
    },

    // 日期格式化（天数补0）
    formatDate: function (d) {
      if (d) {
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
      } else {
        return 0
      }
    },

    datasSubmit: function (formName) {
      var vm = this
      var from = vm.formatDate(vm.filterData.date[0]), to = vm.formatDate(vm.filterData.date[1])
      window.open(`${vm.SConfig.assets}/export/article/${from}/${to}`)
      vm.CancelDialog()
    }
  },
  data () {
    var vm = this
    return {
      isPosting: false, openStatus: false,
      filterData: { date: '', cate_id: '' },
      CurrentCateValue: [], cascaderProps: { value: 'id', label: 'label' },
      startEndOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date(), start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date(), start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date(), start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date(), start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
      //
    }
  }
}
</script>
