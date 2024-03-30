const path = require('path');

module.exports = {
  entry: {
    main_ancient: './src/output/worker.mjs',
    main_de: './src/output/worker_de.mjs',
    // main_vsop: './src/output/vsop_worker.mjs'
  },
  output: {
    filename: '[name].js', // 使用占位符[name]为每个入口生成唯一的文件名
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production'
};