const Express = require('express');
const webpack = require('webpack');
const portfinder = require('portfinder');
const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

// config
const SERVER_CONFIG = {
  host: 'localhost',
  port: 8080,
  devMiddlewareOptions: {
    publicPath: webpackConfig.output.publicPath,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    stats: {
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: true,
      timings: true,
      version: false,
    },
    writeToDisk: false, // 编译结果是否写入硬盘
  },
};

const app = new Express();

// 前端路由
app.use(
  require('connect-history-api-fallback')({
    index: '/index.html',
  }),
);

app.use(
  require('webpack-dev-middleware')(
    compiler,
    SERVER_CONFIG.devMiddlewareOptions,
  ),
);
app.use(
  require('webpack-hot-middleware')(compiler, {
    heartbeat: 5000, // 一定要设置心跳时间，并且心跳时间必须小于设置的timeout，否则会导致控制台输出 [HMR] connected 两次
  }),
);

// 寻找可用端口
portfinder
  .getPortPromise({ port: SERVER_CONFIG.port })
  .then(port => {
    if (port !== SERVER_CONFIG.port) {
      console.warn(`${SERVER_CONFIG.port}端口被占用，开启新的端口${port}`);
    }

    app.listen(port, err => {
      if (err) {
        console.error(err);
        return;
      }

      console.info(`请打开http://${SERVER_CONFIG.host}:${port}`);
    });
  })
  .catch(error => {
    console.error('没有找到空闲端口，请打开任务管理器杀死进程端口再试', error);
  });
