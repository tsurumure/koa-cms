<template>
	<el-main>

    <h2>欢迎登录，{{UserInfo.nickname}}</h2>
    <!-- <div class="iCountUp home_iCountUp">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="simple-card">
            <div slot="header">昨日访问</div>
            <ICountUp :startVal="0" :endVal="1246" :decimals="0" :duration="2" />
            <em>昨</em>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="simple-card">
            <div slot="header">今日访问</div>
            <ICountUp :startVal="0" :endVal="1587" :decimals="0" :duration="2" />
            <em>今</em>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="simple-card">
            <div slot="header">本周访问</div>
            <ICountUp :startVal="0" :endVal="8987" :decimals="0" :duration="2" />
            <em>周</em>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card class="simple-card">
      <div slot="header">近十天访问</div>
      <g2-line :charData="serverData" :id="'nearlyTenDay'"></g2-line>
    </el-card> -->

	</el-main>
</template>
<script>
// import ICountUp from 'vue-countup-v2'
// import G2Line from '@/Views/public/G2/line.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  // components: { ICountUp, G2Line },
  // mounted () {
  //   this.GetTongji()
  // },
  // methods: {
  //   ...mapActions({
  //     'GetTongji': 'Site/GetTongji'
  //   })
  // },
  computed: {
    ...mapGetters({
      'UserInfo': 'Public/UserInfo'
    })
  },
  data () {
    return {
      serverData: [
        { _Date: '07.15', Inland: 54, Foreign: 48 },
        { _Date: '07.16', Inland: 60, Foreign: 56 },
        { _Date: '07.17', Inland: 66, Foreign: 62 },
        { _Date: '07.18', Inland: 70, Foreign: 80 },
        { _Date: '07.19', Inland: 84, Foreign: 107 },
        { _Date: '07.20', Inland: 90, Foreign: 110 },
        { _Date: '07.21', Inland: 115, Foreign: 120 },
        { _Date: '07.22', Inland: 110, Foreign: 130 },
        { _Date: '07.23', Inland: 114, Foreign: 120 },
        { _Date: '07.24', Inland: 120, Foreign: 130 },
        { _Date: '07.25', Inland: 135, Foreign: 140 }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
@import url(home.less);
</style>
