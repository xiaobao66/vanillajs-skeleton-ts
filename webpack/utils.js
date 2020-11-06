// 获取argv
exports.getArgv = () => {
  const yargs = require('yargs/yargs');
  const { hideBin } = require('yargs/helpers');

  return yargs(hideBin(process.argv)).argv;
};

// 获取port
exports.getPort = () => {
  const portfinder = require('portfinder');

  const BASE_PORT = 8080;

  return portfinder
    .getPortPromise({ port: 8080 })
    .then(port => {
      if (port !== BASE_PORT) {
        console.warn(`${BASE_PORT}端口被占用，启用新端口${port}`);
      }

      return port;
    })
    .catch(error => {
      console.error(
        `没有找到空闲端口，请打开任务管理器杀死进程端口再试`,
        error,
      );
    });
};

// 获取entry
exports.getEntry = () => {
  const entry = {
    app: ['./src/index.ts'],
  };

  return Promise.resolve(entry);
};
