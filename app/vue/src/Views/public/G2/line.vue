<template>
  <div :id="id"></div>
</template>
<script>
/* eslint-disable */
// https://antv.alipay.com/zh-cn/g2/3.x/demo/index.html

import { DataSet } from '@antv/data-set/lib/data-set'
require('@antv/data-set/lib/transform/fold')
require('@antv/data-set/lib/transform/map')

import G2 from '@antv/g2/lib/core'
require('@antv/g2/lib/geom/line')
require('@antv/g2/lib/geom/point')

G2.track(false)
/* eslint-disable */

export default {
  data () {
    return {
      chart: null
    }
  },
  props: { charData: Array, id: String },
  mounted: function () {
    this.drawChart(this.charData)
  },
  watch: {
    charData: function (val, oldVal) {
      this.drawChart(val)
    }
  },
  methods: {
    drawChart: function (datas) {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        id: this.id,
        forceFit: true
      })

      const ds = new DataSet()
      const dv = ds.createView().source(datas)

      dv.transform({
        type: 'map',
        callback (row) {
          return { _Date: row._Date, '国内流量': row.Inland, '国外流量': row.Foreign }
        }
      })
      dv.transform({
        type: 'fold',
        fields: ['国内流量', '国外流量'],
        key: 'area_key', value: 'area_value'
      })

      this.chart.source(dv, {
        _Date: {
          range: [0, 1]
        }
      })

      this.chart.tooltip({
        crosshairs: { type: 'line' }
      })
      this.chart.axis('area_value', {
        label: {
          formatter: function (val) {
            return val
          }
        }
      })
      this.chart.line().position('_Date*area_value').color('area_key')
      this.chart.point().position('_Date*area_value').color('area_key').size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      })
      this.chart.render()
    }
  }
}
</script>
