const { env } = require('process');

const target = 'http://localhost:5167';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api"
    ],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;
