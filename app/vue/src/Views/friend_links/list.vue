<template>
<el-main>

  <el-card>
    <h2 class="card_title">
      友情链接
      <em><i class="el-icon-key"></i>管理员可见</em>
      <div class="right">
        <el-button type="primary" size="mini" icon="el-icon-document" @click="isOpenDialog=true">新增友情链接</el-button>
        <el-button class="auto" size="mini" icon="el-icon-refresh" @click="RefreshList()" :loading="FriendLinksList_Loading"></el-button>
      </div>
      <create-friend-link :open="isOpenDialog" @close="isOpenDialog=false"></create-friend-link>

    </h2>

    <el-table :data="FriendLinksList" v-loading="FriendLinksList_Loading" :empty-text="`暂无数据`">
      <el-table-column prop="title" label="标题" width="300"></el-table-column>
      <el-table-column prop="url" label="链接"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="isOpenDialog_update=true; updateData=scope.row">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="openDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <update-friend-link :open="isOpenDialog_update" :data="updateData" @close="isOpenDialog_update=false; updateData={}"></update-friend-link>

  </el-card>

</el-main>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import Cookie from 'vue-cookie'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import createFriendLink from './com.create.friendLink'
import updateFriendLink from './com.update.friendLink'

/* eslint-disable */
export default {
  components: { createFriendLink, updateFriendLink },
  computed: {
    ...mapState({
      'FriendLinksList_Loading': state => state.FriendLinks.FriendLinksList_Loading,
      'FriendLinksList': state => state.FriendLinks.FriendLinksList
    })
  },
  mounted () {
    this.RefreshList()
  },
  methods: {
    //
    ...mapActions({
      'GetFriendLinks': 'FriendLinks/GetFriendLinks',
      'UpdateFriendLink': 'FriendLinks/UpdateFriendLink',
      'DeleteFriendLink': 'FriendLinks/DeleteFriendLink'
    }),
    RefreshList: function () {
      this.GetFriendLinks()
    },

    openCreate: function (e) {
      let vm = this
    },
    openEdit: function (e) {
      let vm = this
    },

    openDelete: function (id) {
      let vm = this
      this.$confirm('确认删除此条记录吗?').then(_ => {
        this.DeleteFriendLink({ id }).then(rs => {
          this.GetFriendLinks()
          if (rs.data.status_code == 0) {
            this.$message({ type: 'success', message: rs.data.message })
          } else {
            this.$message({ type: 'error', message: rs.data.message })
          }
        })
      }).catch(_ => {})
    }

  },
  data () {
    return {
      isOpenDialog: false, isOpenDialog_update: false, updateData: {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
