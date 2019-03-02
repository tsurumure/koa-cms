<!-- 已弃用，但可作为递归组件参考 -->
<template>
<div class="table-tree">
  <div v-for="(item) in list" :key="item.id">
    <table class="el-table__body" style="width:100%" >
      <colgroup><col width="60" align="center"></colgroup>
      <tbody>
        <tr>
          <td v-html="item.id" class="is-center"></td>
          <td v-html="item.label" class="tree-label"></td>
        </tr>
      </tbody>
    </table>
    <tableTree v-if="item.children" :list="item.children"></tableTree>
  </div>
</div>
</template>
<script>
import tableTree from './_tree'
export default {
  name: 'tableTree',
  components: { tableTree },
  props: ['list'],
  list () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.table-tree{
  .table-tree{
    padding-left:20px;
    .tree-label{
    }
  }
}
</style>
