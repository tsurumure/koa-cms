const decorator = require('./decorator')
const auth = require('./decorator/auth')

@decorator.Controller({ prefix: '/manager' })
class ManagerController {

  // [View] 首页
  @decorator.Request({ url: '/', method: decorator.RequestMethod.GET })
  async index(ctx) {
    ctx.render('manager/index', { ctx })
  }

}
module.exports = ManagerController
