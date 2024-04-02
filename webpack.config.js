const path = require('path');

module.exports = {
  entry: {
    worker_ancient: './src/output/worker_ancient.mjs',
    worker_modern: './src/output/worker_modern.mjs',
  },
  output: {
    filename: '[name].min.js', // 使用占位符[name]为每个入口生成唯一的文件名
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production'
};