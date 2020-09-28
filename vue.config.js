// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugin('preload')
  }
}
