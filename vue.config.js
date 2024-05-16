const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 将依赖项透明编译设置保留
  transpileDependencies: [],

  // 保留现有的开发服务器设置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  // Vuetify 插件选项保持原样
  pluginOptions: {
    vuetify: {
      // 配置选项
    }
  },

  // 指定构建输出目录到你的扩展文件夹
  outputDir: 'C:/Users/homepc/Desktop/password_manage/password_manage/extension',
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',

  // 配置页面
  pages: {
    popup: {
      entry: 'src/main.js', // 指定入口文件
      template: 'public/popup.html', // 指定模板文件
      filename: 'popup.html' // 指定输出文件名
    },
    // 确保其他页面使用不同的 HtmlWebpackPlugin 实例
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },

  // 配置 webpack 的输出，确保文件名规则一致
  configureWebpack: {
    output: {
      filename: '[name].js'
    }
  },
  chainWebpack: config => {
    // 清除已有的所有 HtmlWebpackPlugin 实例
    config.plugins.delete('html-popup');
    config.plugins.delete('html-index');

    // 为 popup 页面添加 HtmlWebpackPlugin 实例
    config.plugin('html-popup')
      .use(HtmlWebpackPlugin, [{
        template: 'public/popup.html',
        filename: 'popup.html',
        chunks: ['chunk-vendors', 'chunk-common', 'popup']
      }]);

    // 为 index 页面添加 HtmlWebpackPlugin 实例
    config.plugin('html-index')
      .use(HtmlWebpackPlugin, [{
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }]);
  },
};
