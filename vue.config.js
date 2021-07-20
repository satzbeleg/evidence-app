module.exports = {
  chainWebpack: config => {
    config.plugin('preload')
  },
  pwa: {
    name: 'Evidence App',
    assetsVersion: '0.1.0'
  }
}