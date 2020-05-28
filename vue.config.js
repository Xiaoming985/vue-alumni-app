module.exports = {
  publicPath: "./",
  devServer: {
    open: false,// 自动打开浏览器
    // host: 'localhost',
    port: 9000,
    https: false,
    hotOnly: false,
    disableHostCheck: true,//Invalid Host header
    proxy: { // 配置跨域
      '/alumni': {
        target: 'http://localhost:8081',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/alumni': '/alumni' 
        }
      }
    },
    before: app => { }
  }
}