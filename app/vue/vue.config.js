// https://cli.vuejs.org/zh/guide/
const path = require('path')
const env = process.env


module.exports = {
    publicPath: env.PUBLIC_PATH, // (process.env.NODE_ENV === 'production') ? './manager' : './', // vueConf.baseUrl, // 根域上下文目录
    outputDir: env.OUTPUT_DIR, // // 构建输出目录 ./dist
    assetsDir: env.ASSETS_DIR, // (process.env.NODE_ENV === 'production') ? '../../../static/manager' : 'assets', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    // css: { // 配置高于chainWebpack中关于css loader的配置
    //     // modules: true, // 是否开启支持‘foo.module.css’样式
    //     // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    //     extract: {
    //         filename: 'assets/css/[name].css?v=[hash:4]',
    //         chunkFilename: 'assets/css/[name].css?v=[hash:4]'
    //     },
    //     sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    //     loaderOptions: { // css预设器配置项
    //         // css: {
    //         //     localIdentName: '[name]-[hash]',
    //         //     camelCase: 'only'
    //         // }
    //         // sass: {
    //         //     data: ''// `@import "@/assets/scss/mixin.scss";`
    //         // }
    //     }
    // },
    // https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
    chainWebpack: config => {
        config
            .output
            .filename('assets/js/[name].js?v=[hash:4]')
            .end()

        // config.module
        // .rule('vue')
        // .use('vue-loader')
        //     .loader('vue-loader')
        //     .tap(options => {
        //     // 修改它的选项...
        //     return options
        //     })

        // 修改图片输出路径
        // config.module
        //   .rule('images')
        //   .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
        //   .use('url-loader')
        //   .loader('url-loader')
        //   .options({
        //       name: path.join('../assets/', 'img2/[name].[ext]')
        //   })

        // 添加别名
        // config.resolve.alias
        // .set('@', resolve('src'))
    },
    filenameHashing: false,
    indexPath: 'template.html',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: env.TEMPLATE_NAME // (process.env.NODE_ENV === 'production') ? 'index.art' : 'index.html'
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            // title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            // chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: { // 第三方插件配置
    },
    pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    configureWebpack: config => {
        // const plugins = []
        // plugins.push(
        //     new UglifyJsPlugin({
        //         uglifyOptions: {
        //             compress: {
        //             warnings: false,
        //             drop_console: true,
        //             drop_debugger: false,
        //             pure_funcs: ['console.log'] // 移除console
        //             }
        //         },
        //         sourceMap: false,
        //         parallel: true
        //     })
        // )
        // config.plugins = [...config.plugins, ...plugins]

        // resolve: {
        //     alias: {
        //         '~styles': path.resolve('./src/assets/styles')
        //     }
        // }

    },
    devServer: {
        // open: true,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        overlay: {
            warnings: true,
            errors: true
        },
        // proxy: null,
        proxy: {
            '/api': {
                target: 'http://localhost:3000/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: { '^/api': '/' }
            }
        },
        before: app => {}
    }
}
