process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true
module.exports = {
    transformIgnorePatterns: [
        '/node_modules/.*'
    ]
}
