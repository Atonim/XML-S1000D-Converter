const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        fs: 'empty'
      },
      fallback: {
        "fs": false
      },
    }
  },
})
