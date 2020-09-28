// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.plugin('prefetch')
    config.plugin('preload')
  }
}
