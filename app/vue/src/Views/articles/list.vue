<template>
<el-main>

	<el-row :gutter="20">
		<el-col :span="19">

			<el-card>
				<h2 class="card_title">
          文章列表
          <em v-level="UserInfo"><i class="el-icon-key"></i>导入导出功能仅管理员可见 (以及此条提示)</em>
        </h2>

        <el-row class="card_handle">

          <el-col :span="12">
            <el-row :gutter="15">
              <el-col :span="16">
                <el-input size="mini" v-model="artKeyword" placeholder="输入文章标题或内容进行搜索，按回车键搜索" prefix-icon="el-icon-search"
              @keyup.enter.native="SearchArticleList(artKeyword)"></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="maxPageCur" placeholder="请选择" size="mini" @change="ChangeMaxPage" style="width:100px;">
                  <el-option v-for="item in maxPageCount" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="12" align="right">
            <router-link :to="'/articles/create'">
              <el-button type="primary" size="mini" icon="el-icon-document">添加文章</el-button>
            </router-link>
            <el-button class="auto" size="mini" icon="el-icon-refresh" @click="RefreshList()" :loading="ArticleList_Loading"></el-button>
            <el-button class="auto" size="mini" :disabled="!isDisplayDelButton" type="danger" icon="el-icon-delete" @click="Article_Delete_Batch()" :loading="isPosting"></el-button>

            <el-menu mode="horizontal" active-text-color="#909399" menu-trigger="click" v-level="UserInfo">
              <el-submenu index="0" :disabled="ArticleList_Loading || (ArticleList.list && ArticleList.list.length == 0)">
                <template slot="title">操作</template>
                <el-menu-item index="1" class="small">
                  <el-upload
                    :on-success="importExcelSuccess"
                    :action="SConfig.api + '/import/article'"
                    :headers="{ 'Authorization' : 'Bearer ' + token }"
                    accept=".xls,.xlsx" :show-file-list="false">
                    <i class="el-icon-export"></i>导入 Excel
                  </el-upload>
                </el-menu-item>
                <el-menu-item index="2" class="small" @click="isExport=true"><i class="el-icon-export_excel"></i>导出为 Excel 文件</el-menu-item>
              </el-submenu>
            </el-menu>

            <export-article :open="isExport" @close="isExport=false"></export-article>

          </el-col>
        </el-row>

				<!-- Datas List -->
				<el-table :data="ArticleList.list" v-loading="ArticleList_Loading"
          @selection-change="Article_Selector" :empty-text="`暂无数据`"
          :row-key="getRowKeys" :expand-row-keys="expands" @row-click="toggleRowExpansion"
        >

          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="是否激活">
                  <el-switch v-model="props.row.is_active" active-color="#13ce66" inactive-color="#cccccc"
                    @change="Article_Change_isActive(props.row.id, props.row.is_active)">
                  </el-switch>
                </el-form-item>
                <el-form-item label="是否置顶">
                  <el-switch v-model="props.row.is_top" active-color="#13ce66" inactive-color="#cccccc"
                    @change="Article_Change_isTop(props.row.id, props.row.is_top)">
                  </el-switch>
                </el-form-item>
                <el-form-item label="创建日期">
                  <i class="el-icon-time"></i>
                  <span>{{ props.row.created_at | curtime }}</span>
                </el-form-item>
                <el-form-item label="发布者">
                  <span>{{ props.row.author}}</span>
                </el-form-item>
                <el-form-item label="操作">
                  <router-link :to="`/articles/edit/${props.row.aid}`"><el-button :disabled="isDisplayDelButton" size="mini" icon="el-icon-edit-outline">编辑</el-button></router-link>
                  <el-button @click="Article_Delete_Single(props.row.aid, props.row.cate_id)" :disabled="isDisplayDelButton" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column prop="title" label="标题"><!-- fixed -->
						<template slot-scope="scope">
              <span v-if="scope.row.is_top" class="text-danger">[置顶]</span>
              <router-link :to="`/articles/edit/${scope.row.aid}`">{{scope.row.title}}</router-link>
              <i v-if="scope.row.image" class="el-icon-image"></i>
						</template>
					</el-table-column>
					<el-table-column prop="cate_label" label="分类" width="200">
            <template slot-scope="scope">
              {{ scope.row.cate_label || '未分类'}}
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="更新日期" width="200" sortable>
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span :class="{ diff : (scope.row.created_at!=scope.row.updated_at)}">
                {{ scope.row.updated_at | curtime }}
              </span>
						</template>
					</el-table-column>
          <el-table-column prop="cate_label" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.is_active" size="mini" type="info">未激活</el-tag>
              <el-tag v-if="scope.row.is_active" size="mini" type="success">已激活</el-tag>
            </template>
          </el-table-column>

				</el-table>

				<el-pagination v-if="!$valid.isJSONempty(ArticleList) && ArticleList.list.length>0 && ArticleList.count>=$store.state.PageLimit"
          :page-size="$store.state.PageLimit" :current-page.sync="$store.state.Articles.PageOffset+1" :total="ArticleList.count"
					layout="total, prev, pager, next, jumper" @current-change="ArticlesList_PageChange" :disabled="ArticleList_Loading">
				</el-pagination>

			</el-card>

		</el-col>
		<el-col :span="5">
			<el-card>
				<h2 class="card_title">文章分类</h2>
        <div class="el-tree-node">
          <div class="el-tree-node__content">
            <span class="el-tree-node__expand-icon el-icon-caret-right is-leaf"></span>
            <div class="custom-tree-node"><div class="tree-label" @click="ArticleCate_Choose()">全部文章</div></div>
          </div>
        </div>
				<el-tree :data="ArticlesCatesTree" :props="{ children: 'children', label: 'label' }"
          :expand-on-click-node="false" default-expand-all highlight-current
          :render-content="ArticleCate_Render"
          >
				</el-tree>
        <router-link :to="`/articles/cates`"  v-level="UserInfo">
          <el-button class="el-button-full" :disabled="isDisplayDelButton" size="mini" icon="el-icon-edit-outline">编辑文章分类</el-button>
        </router-link>
			</el-card>
		</el-col>
	</el-row>


</el-main>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import NProgress from 'nprogress'
import { Tree } from 'element-ui'
Vue.use(Tree)

import Cookie from 'vue-cookie'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import filters from '@/filters/moment'

import exportArticle from './com.export.article'

/* eslint-disable */
export default {
  filters,
  components: { exportArticle },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    }),
    ...mapState({
      'ArticleList_Loading': state => state.Articles.ArticleList_Loading,
      'ArticleList': state => state.Articles.ArticleList
    }),
    ArticlesCatesTree () {
      return this.$utils._toTree(_.sortBy(this.$store.state.Articles.ArticleCateTree, ['sort']))
    }
  },
  mounted () {
    this.RefreshList()
  },
  methods: {
    importExcelSuccess: function (rs) {
      this.$message({ type: 'success', message: rs.message })
      this.RefreshList()
    },
    //
    ...mapActions({
      'GetArticlesList': 'Articles/GetArticlesList',
      'GetArticlesCatesList': 'Articles/GetArticlesCatesList',
      'DeleteArticle_Batch': 'Articles/DeleteArticle_Batch',
      'DeleteArticle_Simple': 'Articles/DeleteArticle_Simple',
      'DeleteArticleCate': 'Articles/DeleteArticleCate',
      'ChangeIsActive': 'Articles/ChangeIsActive',
      'ChangeIsTop': 'Articles/ChangeIsTop',
      'CreateArticleCate': 'Articles/CreateArticleCate',
      'UpdateArticleCate': 'Articles/UpdateArticleCate',
      'UpdateArticleCateSort': 'Articles/UpdateArticleCateSort'
    }),
    RefreshList: function () {
      this.artKeyword = ''
      this.$store.state.Articles.Keyword = this.artKeyword
      this.maxPageCur = 10
      this.$store.state.PageLimit = this.maxPageCur
      this.$store.state.Articles.PageOffset = 0
      this.GetArticlesList()
      this.GetArticlesCatesList()
    },

    // ------------------------------------- 列表 -------------------------------------

    // [Get] 文章分页 Click
    ArticlesList_PageChange: function (v) {
      this.$store.state.Articles.PageOffset = v - 1
      // CatdId
      if (this.$store.state.Articles.CateId) {
        this.GetArticlesList({ PageOffset: v - 1, CateId: this.$store.state.Articles.CateId })
      } else {
        // Keyword
        if (this.$store.state.Articles.Keyword) {
          this.GetArticlesList({ PageOffset: v - 1, Keyword: this.$store.state.Articles.Keyword })
        } else {
          this.GetArticlesList({ PageOffset: v - 1 })
        }
        //
      }
      //
    },

    // [Selector] 选中需要删除的文章
    Article_Selector: function (v) {
      this.DelChecked = { aid: [], cate_id: []}
      v.forEach((item) => {
        this.DelChecked['aid'].push(item.aid)
        this.DelChecked['cate_id'].push(item.cate_id)
      })
      this.isDisplayDelButton = (v.length > 0)
    },

    // [Post] 删除文章 (批量)
    Article_Delete_Batch: function () {
      var vm = this
      this.$confirm(`确定批量删除此 ${vm.DelChecked.aid.length} 条记录吗?`).then(_ => {
        //
        this.DeleteArticle_Batch({
          aid: this.DelChecked.aid.join(','),
          cate_id: this.DelChecked.cate_id.join(',')
        }).then((rs) => {
          if (rs.data.status_code == 0) {
            // 静态删除
            const selectIds = this.DelChecked.aid
            selectIds.forEach((selectId) => {
              this.ArticleList.list.forEach((itemArt, i) => {
                if (itemArt.aid === selectId) {
                  this.ArticleList.list.splice(i, 1)
                }
              })
            })
            //
            this.RefreshList()
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    },

    // [Post] 删除文章 (单条)
    Article_Delete_Single: function (aid, cate_id) {
      this.$confirm('确认删除此条记录吗?').then(_ => {
        this.DeleteArticle_Simple({ aid, cate_id }).then((rs) => {
          if (rs.data.status_code == 0) {
            // 静态删除
            this.ArticleList.list.forEach((item, i) => {
              if (item.aid === aid) {
                this.ArticleList.list.splice(i, 1)
              }
            })
            this.RefreshList()
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    },



    // [Post] 文章状态(on/off)
    Article_Change_isActive: function (id, is_active) {
      this.ChangeIsActive({ id, is_active }).then((rs) => {
        if (rs.data.status_code == 0) {
          this.$message({ type: 'success', message: rs.data.message })
        } else {
          // 静态回调 Switch
          this.ArticleList.list.forEach((item, i) => {
            if (item.id == id) {
              this.ArticleList.list[i].is_active = !is_active;
            }
          })
          //
          this.$message({ type: 'error', message: rs.data.message })
        }
      })
    },

    // [Post] 文章是否置顶(on/off)
    Article_Change_isTop: function (id, is_top) {
      this.ChangeIsTop({ id, is_top }).then((rs) => {
        if (rs.data.status_code == 0) {
          this.$message({ type: 'success', message: rs.data.message })
        } else {
          // 静态回调 Switch
          this.ArticleList.list.forEach((item, i) => {
            if (item.id == id) {
              this.ArticleList.list[i].is_top = !is_top;
            }
          })
          //
          this.$message({ type: 'error', message: rs.data.message })
        }
      })
    },

    // ------------------------------------- 分类 -------------------------------------
    // [Init] 分类树渲染
    ArticleCate_Render (h, { node, data, store }) {
      return (
        <div class={ data.hover ? "custom-tree-node node-hover" : "custom-tree-node" }>
          <div class="tree-label" on-click={ () => { this.ArticleCate_Choose(data) } }>
            {node.label} ({data.count})
          </div>
        </div>
      )
    },
    // [Click Label] Tree 选中分类
    ArticleCate_Choose (data) {
      this.artKeyword = ''
      this.$store.state.Articles.Keyword = this.artKeyword
      this.$store.state.Articles.PageOffset = 0
      this.$store.state.Articles.CateId = data ? data.id : ''
      this.GetArticlesList({ CateId: data ? data.id : '' })
    },
    //
    // [筛选] 每页显示几条文章
    ChangeMaxPage: function (v) {
      this.artKeyword = ''
      this.$store.state.Articles.Keyword = this.artKeyword
      this.$store.state.Articles.CateId = ''
      this.$store.state.PageLimit = v
      this.GetArticlesList()
    },
    // [筛选] 搜索文章（标题或内容）
    SearchArticleList: function (Keyword) {
      if (Keyword) {
        this.$store.state.Articles.Keyword = Keyword
        this.GetArticlesList({ Keyword })
      } else {
        this.$message({ type: 'error', message: '关键字不能为空' })
      }
    },
    //
    // <el-table 手风琴
    getRowKeys (row) { return row.id },
    toggleRowExpansion (row) {
      this.expands = []; this.expands.push(row.id)
    }
  },
  data () {
    return {
      token: Cookie.get('token'),
      isImport: false, isExport: false,
      artKeyword: '',
      maxPageCount: [
        { value: 10, label: '10 条/页' },
        { value: 20, label: '20 条/页' },
        { value: 50, label: '50 条/页' }
      ],
      maxPageCur: this.$store.state.PageLimit,
      expands: [],
      isDisplayDelButton: false,
      DelChecked: { aid: [], cate_id: [] },
      createTimeOptions: { editable: false }, isPosting: false,
      defaultProps: { children: 'children', label: 'label' }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('articles.less');
</style>
