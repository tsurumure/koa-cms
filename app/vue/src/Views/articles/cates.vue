<template>
<el-main>

  <el-card>
    <h2 class="card_title">
      编辑文章分类
      <em><i class="el-icon-key"></i>管理员可见</em>
      <div class="right">
        <el-button type="primary" size="mini" icon="el-icon-document" :disabled="this.ArticleCateTree_Loading" @click="ArticleCate_Create()">新增一级分类</el-button>
      </div>
    </h2>

    <el-alert style="margin-bottom:15px;" title="提示：拖动分类可以进行排序" :closable="false"></el-alert>

    <el-tree class="PageTree" :data="ArticlesCatesTree" :props="{ children: 'children', label: 'label' }"
      :expand-on-click-node="false" highlight-current
      :render-content="ArticleCate_Render" draggable
      @node-drop="ArticleCate_Update_Sort" v-loading="this.ArticleCateTree_Loading"
      >
    </el-tree>

  </el-card>

</el-main>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

import Cookie from 'vue-cookie'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import filters from '@/filters/moment'
/* eslint-disable */
export default {
  filters,
  computed: {
    ...mapState({
      'ArticleCateTree_Loading': state => state.Articles.ArticleCateTree_Loading,
    }),
    ArticlesCatesTree () {
      return this.$utils._toTree(_.sortBy(this.$store.state.Articles.ArticleCateTree, ['sort']))
    }
  },
  mounted () {
    this.RefreshList()
  },
  methods: {
    //
    ...mapActions({
      'GetArticlesCatesList': 'Articles/GetArticlesCatesList',
      'DeleteArticleCate': 'Articles/DeleteArticleCate',
      'CreateArticleCate': 'Articles/CreateArticleCate',
      'UpdateArticleCate': 'Articles/UpdateArticleCate',
      'UpdateArticleCateSort': 'Articles/UpdateArticleCateSort'
    }),
    RefreshList: function () {
      this.$store.state.Articles.PageOffset = 0
      this.GetArticlesCatesList(this)
    },

    // ------------------------------------- 分类 -------------------------------------
    // [Init] 分类树渲染
    ArticleCate_Render (h, { node, data, store }) {
      let delDOM, editDOM, loadingDOM;
      delDOM = <a href="javascript:;" on-click={ () => this.ArticleCate_Delete(node, data) }><i class="el-icon-delete"></i>删除</a>
      editDOM = <a href="javascript:;" on-click={ () => this.ArticleCate_Update(node, data) } ><i class="el-icon-edit-outline"></i>编辑</a>
      return (
        <div class={ data.hover ? "custom-tree-node node-hover" : "custom-tree-node" }>
          <div class="tree-label">
            {node.label} ({data.count})
          </div>
          <div class="tree-buttons">
            <a href="javascript:;" on-click={ () => this.ArticleCate_Create(data) }><i class="el-icon-circle-plus-outline"></i>新增子分类</a>
            {editDOM}
            {delDOM}
          </div>
        </div>
      )
    },
    // [Post] 修改分类排序
    ArticleCate_Update_Sort(draggingNode, dropNode, dropType, ev) {
      this.$confirm('确定要修改此分类的排序吗?').then(_ => {
        this.UpdateArticleCateSort({
          type: dropType,
          id: draggingNode.data.id, target_id: dropNode.data.id
        }).then((rs) => {
          this.GetArticlesCatesList(this)
          this.$message({ type: 'success', message: rs.data.message })
        })
      }).catch(_ => {
        this.GetArticlesCatesList(this)
      })
    },

    // [Prompt Post] 添加分类（无 data 则新增一级分类）
    ArticleCate_Create (data) {
      this.$prompt(
        data ? `在 <b>${data.label}</b> 下新增` : '', data ? '新增子分类' : '新增一级分类',
        { dangerouslyUseHTMLString: true, inputPlaceholder: '输入名称' }
      ).then((input) => {

        this.CreateArticleCate({
          label: input.value, pid: data ? data.id : 0,
          sort: (data ? (data.children ? (_.last(data.children).sort + 1) : 0) : (_.last(this.ArticlesCatesTree) ? _.last(this.ArticlesCatesTree).sort + 1 : ''))
        }).then((rs) => {
          if (rs.data.status_code == 0) {
            this.GetArticlesCatesList(this)
            this.$message({ type: 'success', message: rs.data.message })
          }
        })

      }).catch(() => {})
    },

    ArticleCate_Update (node) {
      this.$prompt(
        '修改 <b>' + node.label + '</b> 分类为', '修改分类',
        { dangerouslyUseHTMLString: true, inputValue: node.label, inputPlaceholder: '输入名称' }
      ).then((input) => {
        this.UpdateArticleCate({
          id: node.data.id, label: input.value
        }).then((rs) => {
          if (rs.data.status_code == 0) {
            this.GetArticlesCatesList(this)
            this.$message({ type: 'success', message: rs.data.message })
          }
        })
      })
    },

    // [Post] 删除分类
    ArticleCate_Delete (node, data) {
      this.$confirm('确认删除此分类吗? 该分类下的文章变为 [未分类] 状态').then(_ => {
        this.DeleteArticleCate(data.id).then((rs) => {
          if (rs.data.status_code == 0) {
            // 静态
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            //
            this.RefreshList()
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    }
    //
  },
  data () {
    return {
      // isDisplayDelButton: false,
      // DelChecked: { aid: [], cate_id: [] }, isOpenCates: false, isOpenDialogCate: false,
      // createTimeOptions: { editable: false }, isPosting: false,
      // defaultProps: { children: 'children', label: 'label' }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('articles.less');
</style>
