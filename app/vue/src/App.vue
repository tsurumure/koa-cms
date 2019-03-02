<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    try {
      document.body.removeChild(document.getElementById('main-loading'))
    } catch (e) { }
  },
  mounted () {
    if (this.$utils._IEVersion() <= 9) { flexibility(document.documentElement) }
  },
  updated () {
    if (this.$utils._IEVersion() <= 9) { flexibility(document.documentElement) }
  }
}
</script>

<style lang="less">
@import url('Views/global.less');
</style>
