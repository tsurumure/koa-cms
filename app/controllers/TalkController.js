const decorator = require('./decorator')
const auth = require('./decorator/auth')

// const getData = require('./decorator/getData')

@decorator.Controller({ prefix: '/talk' })
class HomeController {

    // [View] 聊天
    @decorator.Request({ url: '/', method: decorator.RequestMethod.GET })
    async index(ctx) {
        // let a = await getData()
        ctx.render('front/talk', { ctx })
    }

}
module.exports = HomeController
