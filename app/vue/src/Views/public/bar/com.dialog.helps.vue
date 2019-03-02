<template>
<div>
  <el-dialog :width="width + 'px'" :title="title" :visible.sync="openStatus" @close="CancelDialog">
    <img :src="img" style="width:100%;"/>
  </el-dialog>
</div>
</template>

<script>
import Cookie from 'vue-cookie'

export default {
  props: ['open', 'title', 'img', 'width'],
  watch: {
    open (v) { this.openStatus = v }
  },
  methods: {
    CancelDialog: function () {
      var vm = this
      vm.openStatus = false
      vm.$emit('close', true)
    }
  },
  data () {
    return {
      openStatus: false
    }
  }
}
</script>
