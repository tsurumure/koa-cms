const decorator = require('./decorator')
const auth = require('./decorator/auth')

// const getData = require('./decorator/getData')

@decorator.Controller({ prefix: '/' })
class HomeController {

    // [View] 首页
    @decorator.Request({ url: '/', method: decorator.RequestMethod.GET })
    async index(ctx) {
        // let a = await getData()
        ctx.render('front/index', { ctx })
    }

    // [View] 关于我们
    @decorator.Request({ url: '/about', method: decorator.RequestMethod.GET })
    @auth()
    async about(ctx) {
        ctx.render('front/about', { ctx })
    }

}
module.exports = HomeController
