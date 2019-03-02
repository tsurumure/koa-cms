import moment from 'moment'
moment.locale('zh-cn')
export default {
  // 今天内发布的，显示类似 "3分钟前" 这样的时间语法(fromNow)
  // 否则显示时间格式(format)
  curtime (date) {
    if (!isNaN(new Date(date).getTime())) {
      var isToday = !(moment(new Date()).isAfter(moment(date).format('YYYY-MM-DD'), 'day'))
      var formatDate = isToday ? moment(date).fromNow() : moment(date).format('YYYY-MM-DD HH:mm')
      return formatDate
    } else {
      return false
    }
  },
  unused (d) {
    if (!d) { return '未登录过' } else { return d }
  }
}
